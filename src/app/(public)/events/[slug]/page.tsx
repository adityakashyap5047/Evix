"use client";

import { getEventBySlug } from "@/actions/event";
import { checkRegistration } from "@/actions/registration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/use-fetch";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import { format, isSameDay } from "date-fns";
import { Calendar, CheckCircle, Clock, ExternalLink, Loader2, MapPin, Share2, Ticket, Users } from "lucide-react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import RegisterModal from "../_components/register-modal";

const EventPage = () => {
    const params = useParams();
    const router = useRouter();
        const { user, isSignedIn } = useUser();
        const [showRegisterModal, setShowRegisterModal] = useState(false);

        const slug: string = params.slug! as string;
        const { data: eventData, loading } = useFetch(getEventBySlug, {
                args: [slug]
        });
        const event = eventData?.event;

        const eventId = event?.id ?? "";
        // Only check registration if user is signed in
        const { data: registrationData, loading: isRegistrationLoading } = useFetch(
            checkRegistration,
            {
                args: [eventId],
                skip: !isSignedIn || !eventId,
                suppressToast: true,
            }
        );
        const isRegistered = registrationData?.isRegistered;

    if (loading || !eventData) {
        return (
            <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!event) {
        return notFound();
    }

    const isEventFull = event?.registrationCount >= (event?.capacity ?? 0);
    const isEventPast = event?.endDate < new Date();
    const isOrganizer = user?.id === event?.organizerId;
    const sameDay = isSameDay(event.startDate, event.endDate);

    function darkenColor(color: string, amount: number) {
        const colorWithoutHash = color.replace("#", "");
        const num = parseInt(colorWithoutHash, 16);
        const r = Math.max(0, (num >> 16) - amount * 255);
        const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
        const b = Math.max(0, (num & 0x0000ff) - amount * 255);
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    }

    const handleRegister = () => {
        if (!isSignedIn) {
            toast.error("Please sign in to register");
            return;
        }
        setShowRegisterModal(true);
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.description.slice(0, 100) + "...",
                    url: url,
                });
            } catch (error) {
                toast.error(String(error));
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <div
            style={{
                backgroundColor: event?.themeColor || "#1e3a8a",
            }}
            className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-8 -mt-6 md:-mt-16 lg:-mt-12 "
        >
            <div className="max-w-7xl mx-auto px-8">
                <div className="mb-8">
                    <Badge variant="secondary" className="mb-3">
                        {getCategoryIcon(event?.category) &&
                            (() => {
                                const Icon = getCategoryIcon(event?.category);
                                return Icon ? <Icon /> : null;
                            })()
                        } {getCategoryLabel(event.category)}
                    </Badge>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
    {/* Date */}
    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5" />
      <span>
        {sameDay
          ? format(event.startDate, "EEEE, MMMM dd, yyyy")
          : `${format(event.startDate, "EEE, MMM dd, yyyy")} - ${format(
              event.endDate,
              "EEE, MMM dd, yyyy"
            )}`}
      </span>
    </div>

    {/* Time */}
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5" />
      <span>
        {sameDay ? (
          <>
            {format(event.startDate, "h:mm a")} - {format(event.endDate, "h:mm a")}
          </>
        ) : (
          <>
            {format(event.startDate, "EEE h:mm a")} - {" "}
            {format(event.endDate, "EEE h:mm a")}
          </>
        )}
      </span>
    </div>
  </div>
                    </div>
                </div>

                {event.coverImageUrl && (
                    <div className="relative h-100 rounded-2xl overflow-hidden mb-6">
                        <Image
                            src={event.coverImageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                    <div className="space-y-8">
                        <Card
                            className={"pt-0"}
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.04)
                                    : "#1e3a8a",
                            }}
                        >
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className={"pt-0"}
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.04)
                                    : "#1e3a8a",
                            }}
                        >
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-purple-500" />
                                    Location
                                </h2>

                                <div className="space-y-3">
                                    <p className="font-medium">
                                        {event.city}, {event.state || event.country}
                                    </p>
                                    {event.address && (
                                        <p className="text-sm text-muted-foreground">
                                            {event.address}
                                        </p>
                                    )}
                                    {event.venue && (
                                        <Button variant="outline" asChild className="gap-2">
                                            <a
                                                href={event.venue}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View on Map
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className={"pt-0"}
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.04)
                                    : "#1e3a8a",
                            }}
                        >
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-bold mb-4">Organizer</h2>
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={event?.organizer?.imageUrl || ""} />
                                        <AvatarFallback>
                                            {event?.organizer?.name && event?.organizer?.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{event?.organizer?.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Event Organizer
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card
                            className={`overflow-hidden py-0`}
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.04)
                                    : "#1e3a8a",
                            }}
                        >
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                                    <p className="text-3xl font-bold">
                                        {event.ticketType === "FREE"
                                            ? "Free"
                                            : `₹${event.ticketPrice}`}
                                    </p>
                                    {event.ticketType === "PAID" && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Pay at event offline
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span className="text-sm">Attendees</span>
                                        </div>
                                        <p className="font-semibold">
                                            {event.registrationCount} / {event.capacity}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">Date</span>
                                        </div>
                                        <p className="font-semibold text-sm">
                                            {format(event.startDate, "MMM dd")}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">Time</span>
                                        </div>
                                        <p className="font-semibold text-sm">
                                            {format(event.startDate, "h:mm a")}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {(isRegistrationLoading || !registrationData) ? (
                                    <div className="space-y-3">
                                        <Button className="w-full" disabled>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </Button>
                                    </div>
                                ) : (
                                isRegistered ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">
                                                You&apos;re registered!
                                            </span>
                                        </div>
                                        <Button
                                            className="w-full gap-2"
                                            onClick={() => router.push("/my-tickets")}
                                        >
                                            <Ticket className="w-4 h-4" />
                                            View Ticket
                                        </Button>
                                    </div>
                                ) : isEventPast ? (
                                    <Button className="w-full" disabled>
                                        Event Ended
                                    </Button>
                                ) : isEventFull ? (
                                    <Button className="w-full" disabled>
                                        Event Full
                                    </Button>
                                ) : isOrganizer ? (
                                    <Button
                                        className="w-full"
                                        onClick={() => router.push(`/events/${event.slug}/manage`)}
                                    >
                                        Manage Event
                                    </Button>
                                ) : (
                                    <Button className="w-full gap-2" onClick={handleRegister}>
                                        <Ticket className="w-4 h-4" />
                                        Register for Event
                                    </Button>
                                ))}

                                {/* Share Button */}
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share Event
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {showRegisterModal && (
                <RegisterModal
                    event={event}
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                />
            )}
        </div>
    );
}

export default EventPage