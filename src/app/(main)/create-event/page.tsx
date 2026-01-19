"use client";

import { createEvent } from "@/actions/event";
import { getCurrentUser } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { City, State } from "country-state-city";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import UpgradeModal from "@/components/upgrade-modal";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import UnsplashImagePicker from "@/components/unsplash-image-picker";
import { toast } from "sonner";

type EventFormData = {
    title: string;
    description: string;
    category: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    locationType: "ONLINE" | "OFFLINE" | "HYBRID";
    venue?: string;
    address?: string;
    city: string;
    state?: string;
    capacity: number;
    ticketType: "FREE" | "PAID";
    ticketPrice?: number;
    coverImageUrl?: string;
    themeColor: string;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Please select a category"),
    startDate: z.date().refine(date => !!date, { message: "Start date is required" }),
    endDate: z.date().refine(date => !!date, { message: "End date is required" }),
    startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
    locationType: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).default("OFFLINE"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    ticketType: z.enum(["FREE", "PAID"]).default("FREE"),
    ticketPrice: z.number().optional(),
    coverImageUrl: z.string().optional(),
    themeColor: z.string().default("#1e3a8a"),
});

const CreateEvent = () => {

    const router = useRouter();
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState("limit");

    const { has } = useAuth();
    const hasPro = has?.({ plan: "pro" });

    const { data: userData } = useFetch(getCurrentUser);
    const currentUser = userData?.user;

    const { fn: createEventFn, loading } = useFetch(createEvent, {
        autoFetch: false
    });

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            locationType: "OFFLINE",
            ticketType: "FREE",
            capacity: 50,
            themeColor: "#1e3a8a",
            category: "",
            state: "",
            city: "",
            startTime: "",
            endTime: "",
        },
    });

    const themeColor = useWatch({ control, name: "themeColor" });
    const ticketType = useWatch({ control, name: "ticketType" });
    const selectedState = useWatch({ control, name: "state" });
    const startDate = useWatch({ control, name: "startDate" });
    const endDate = useWatch({ control, name: "endDate" });
    const coverImageUrl = useWatch({ control, name: "coverImageUrl" });

    const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
    const cities = useMemo(() => {
        if (!selectedState) return [];
        const st = indianStates.find((s) => s.name === selectedState);
        if (!st) return [];
        return City.getCitiesOfState("IN", st.isoCode);
    }, [selectedState, indianStates]);

    const colorPresets = [
        "#1e3a8a",
        ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : []),
    ];

    const handleColorClick = (color: string) => {
        if (color !== "#1e3a8a" && !hasPro) {
            setUpgradeReason("color");
            setShowUpgradeModal(true);
            return;
        }
        setValue("themeColor", color);
    };

    const combineDateTime = (date: Date, time: string): Date | null => {
        if (!date || !time) return null;
        const [hh, mm] = time.split(":").map(Number);
        const d = new Date(date);
        d.setHours(hh, mm, 0, 0);
        return d;
    };

    const onSubmit = async (data: EventFormData) => { 
        try {
            console.log(data.startDate, data.startTime);
            console.log(data.endDate, data.endTime);
            const start = combineDateTime(data.startDate, data.startTime ?? "");
            const end = combineDateTime(data.endDate, data.endTime ?? "");
            console.log("Combined:", start, end);
            if (!start || !end) {
                toast.error("Please select both date and time for start and end.");
                return;
            }
            if (end.getTime() <= start.getTime()) {
                toast.error("End date/time must be after start date/time.");
                return;
            }
    
            if (!hasPro && (currentUser?.freeEventsCreated ?? 0) >= 1) {
                setUpgradeReason("limit");
                setShowUpgradeModal(true);
                return;
            }
    
            if (data.themeColor !== "#1e3a8a" && !hasPro) {
                setUpgradeReason("color");
                setShowUpgradeModal(true);
                return;
            }
    
            await createEventFn({
                title: data.title,
                description: data.description,
                category: data.category,
                tags: [data.category],
                startDate: start,
                endDate: end,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locationType: data.locationType,
                venue: data.venue || undefined,
                address: data.address || undefined,
                city: data.city,
                state: data.state || undefined,
                country: "India",
                capacity: data.capacity,
                ticketType: data.ticketType,
                ticketPrice: data.ticketPrice || undefined,
                coverImageUrl: data.coverImageUrl || undefined,
                themeColor: data.themeColor,
            });
    
            toast.success("Event created successfully!");
            router.push("/my-events");
    
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create event");
        }
    };

    return (
        <div
            className="transition-colors duration-300 px-6 py-8 -mt-6 md:-mt-16 lg:-mt-12 lg:rounded-md"
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-5 md:flex-row justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold">Create Event</h1>
                    {!hasPro && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Free: {currentUser?.freeEventsCreated || 0}/1 events created
                        </p>
                    )}
                </div>
                {/* <AIEventCreator onEventGenerated={handleAIGenerate} /> */}
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-[320px_1fr] gap-10">
                <div className="space-y-6">
                    <div
                        className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border"
                        onClick={() => setShowImagePicker(true)}
                    >
                        {coverImageUrl ? (
                            <Image
                                src={coverImageUrl}
                                alt="Cover"
                                className="w-full h-full object-cover"
                                width={500}
                                height={500}
                                priority
                            />
                        ) : (
                            <span className="opacity-60 text-sm">
                                Click to add cover image
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Theme Color</Label>
                            {!hasPro && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Pro
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {colorPresets.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${!hasPro && color !== "#1e3a8a"
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:scale-110"
                                        }`}
                                    style={{
                                        backgroundColor: color,
                                        borderColor: themeColor === color ? "white" : "transparent",
                                    }}
                                    onClick={() => handleColorClick(color)}
                                    title={
                                        !hasPro && color !== "#1e3a8a"
                                            ? "Upgrade to Pro for custom colors"
                                            : ""
                                    }
                                />
                            ))}
                            {!hasPro && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUpgradeReason("color");
                                        setShowUpgradeModal(true);
                                    }}
                                    className="w-10 h-10 cursor-pointer rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center hover:border-purple-500 transition-colors"
                                    title="Unlock more colors with Pro"
                                >
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                </button>
                            )}
                        </div>
                        {!hasPro && (
                            <p className="text-xs text-muted-foreground">
                                Upgrade to Pro to unlock custom theme colors
                            </p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div>
                        <Input
                            {...register("title")}
                            placeholder="Event Name"
                            className="text-3xl font-semibold bg-transparent border-none focus-visible:ring-0"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-400 mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Start */}
                        <div className="space-y-2">
                            <Label className="text-sm">Start</Label>
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {startDate ? format(startDate, "PPP") : "Pick date"}
                                            <CalendarIcon className="w-4 h-4 opacity-60" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => setValue("startDate", date ?? new Date())}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input
                                    type="time"
                                    className="cursor-pointer"
                                    {...register("startTime")}
                                    placeholder="hh:mm"
                                />
                            </div>
                            {(errors.startDate || errors.startTime) && (
                                <p className="text-sm text-red-400">
                                    {errors.startDate?.message || errors.startTime?.message}
                                </p>
                            )}
                        </div>

                        {/* End */}
                        <div className="space-y-2">
                            <Label className="text-sm">End</Label>
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {endDate ? format(endDate, "PPP") : "Pick date"}
                                            <CalendarIcon className="w-4 h-4 opacity-60" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => setValue("endDate", date ?? new Date())}
                                            disabled={(date) => date < (startDate || new Date())}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input
                                    type="time"
                                    {...register("endTime")}
                                    className="cursor-pointer"
                                    placeholder="hh:mm"
                                />
                            </div>
                            {(errors.endDate || errors.endTime) && (
                                <p className="text-sm text-red-400">
                                    {errors.endDate?.message || errors.endTime?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm">Category</Label>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {<cat.icon />} {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-400">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                        <Label className="text-sm">Location</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={control}
                                name="state"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setValue("city", "");
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {indianStates.map((s) => (
                                                <SelectItem key={s.isoCode} value={s.name}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            <Controller
                                control={control}
                                name="city"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={!selectedState}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={
                                                    selectedState ? "Select city" : "Select state first"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((c) => (
                                                <SelectItem key={c.name} value={c.name}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2 mt-6">
                            <Label className="text-sm">Venue Details</Label>

                            <Input
                                {...register("venue")}
                                placeholder="Venue link (Google Maps Link)"
                                type="url"
                            />
                            {errors.venue && (
                                <p className="text-sm text-red-400">{errors.venue.message}</p>
                            )}

                            <Input
                                {...register("address")}
                                placeholder="Full address / street / building (optional)"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            {...register("description")}
                            placeholder="Tell people about your event..."
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Ticketing */}
                    <div className="space-y-3">
                        <Label className="text-sm">Tickets</Label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="FREE"
                                    {...register("ticketType")}
                                    defaultChecked
                                />{" "}
                                Free
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" value="PAID" {...register("ticketType")} />{" "}
                                Paid
                            </label>
                        </div>

                        {ticketType === "PAID" && (
                            <Input
                                type="number"
                                placeholder="Ticket price ₹"
                                {...register("ticketPrice", { valueAsNumber: true })}
                            />
                        )}
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                        <Label className="text-sm">Capacity</Label>
                        <Input
                            type="number"
                            {...register("capacity", { valueAsNumber: true })}
                            placeholder="Ex: 100"
                        />
                        {errors.capacity && (
                            <p className="text-sm text-red-400">{errors.capacity.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 text-lg rounded-xl"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                            </>
                        ) : (
                            "Create Event"
                        )}
                    </Button>
                </form>
            </div>

            {showImagePicker && (
                <UnsplashImagePicker
                    isOpen={showImagePicker}
                    onClose={() => setShowImagePicker(false)}
                    onSelect={(url: string) => {
                        setValue("coverImageUrl", url);
                        setShowImagePicker(false);
                    }}
                />
            )}

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                trigger={upgradeReason}
            />
        </div>
    )
}

export default CreateEvent