"use client";

import {
    getCateogyCount,
    getEvents,
    getEventsByLocation,
} from "@/actions/events";
import { getCurrentUser } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import useFetch from "@/hooks/use-fetch";
import { User } from "@/lib/Type";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Calendar, Loader2, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createLocationSlug } from "@/utils/location";
import EventCard from "@/components/event-card";
import { CATEGORIES } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
    const router = useRouter();

    const { user, isLoaded } = useUser();
    const clerkUserId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getCurrentUser(clerkUserId ?? "");
            setCurrentUser(response.data?.user || null);
        };
        fetchData();
    }, [isLoaded, clerkUserId]);

    const { data: featuredEvents, loading: loadingFeaturedEvents } = useFetch(
        getEvents,
        {
            args: [1, 3],
        },
    );

    const { data: localEvents, loading: loadingLocalEvents } = useFetch(
        getEventsByLocation,
        {
            args: [
                currentUser?.location?.city ?? "",
                currentUser?.location?.state ?? "",
                "",
                1,
                4,
            ],
        },
    );;

    const { data: popularEvents, loading: loadingPopularEvents } = useFetch(
        getEvents,
        {
            args: [1, 6],
        },
    );

    const { data: categoryCounts } = useFetch(getCateogyCount);

    const handleEventClick = (slug: string) => {
        router.push(`/events/${slug}`);
    }

    const handleViewLocalEvents = () => {
        const city = currentUser?.location?.city;
        const state = currentUser?.location?.state;

        const slug = createLocationSlug(city ?? "", state ?? "");
        router.push(`/events/${slug}`);
    }

    const categoriesWithCounts = CATEGORIES.map((cat) => {
        return {
            ...cat,
            count: categoryCounts?.counts?.[cat.id] || 0,
        }
    })

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/events/${categoryId}`);
    }

    const isLoading = loadingFeaturedEvents || loadingLocalEvents || loadingPopularEvents;

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <>
            <div className="pb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Explore featured events, find what&apos;s happening locally, or browse
                    events across India
                </p>
            </div>

            {featuredEvents?.featured && featuredEvents?.featured.length > 0 && (
                <div className="mb-16">
                    <Carousel
                        plugins={[plugin.current]}
                        opts={{ loop: true }}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent>
                            {featuredEvents.featured.map((event) => (
                                <CarouselItem key={event.id}>
                                    <div
                                        className="relative h-100 rounded-xl overflow-hidden cursor-pointer"
                                        onClick={() => handleEventClick(event.slug)}
                                    >
                                        {event.coverImageUrl ? (
                                            <Image
                                                src={event.coverImageUrl}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    backgroundColor: event.themeColor ?? "#888888",
                                                }}
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30" />
                                        <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                                            <Badge className="w-fit mb-4" variant="secondary">
                                                {event.city}, {event.state || event.country}
                                            </Badge>
                                            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
                                                {event.title}
                                            </h2>
                                            <p className="text-lg text-white/90 mb-4 max-w-2xl line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-white/80">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {format(event.startDate, "PPP")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-sm">{event.city}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {event.registrationCount} registered
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>
                </div>
            )}

            {localEvents?.events && localEvents.events.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-1">Events Near You</h2>
                            <p className="text-muted-foreground">
                                Happening in {currentUser?.location?.city || "your area"}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleViewLocalEvents}
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {localEvents.events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                variant="grid"
                                onClick={() => handleEventClick(event.slug)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {categoriesWithCounts.map((category) => (
                        <Card
                            key={category.id}
                            className="py-2 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50"
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <CardContent className="px-3 sm:p-6 flex items-center gap-3">
                                <div className="text-3xl sm:text-4xl">{<category.icon />}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                                        {category.label}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {category.count} Event{category.count !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {popularEvents?.featured && popularEvents?.featured.length > 0 && (
                <div className="mb-16">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-1">Popular Across India</h2>
                        <p className="text-muted-foreground">Trending events nationwide</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularEvents?.featured.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                variant="list"
                                onClick={() => handleEventClick(event.slug)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!loadingFeaturedEvents &&
                !loadingLocalEvents &&
                !loadingPopularEvents &&
                (!featuredEvents?.events || featuredEvents.events.length === 0) &&
                (!localEvents?.events || localEvents.events.length === 0) &&
                (!popularEvents?.events || popularEvents.events.length === 0) && (
                    <Card className="p-12 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold">No events yet</h2>
                            <p className="text-muted-foreground">
                                Be the first to create an event in your area!
                            </p>
                            <Button asChild className="gap-2">
                                <a href="/create-event">Create Event</a>
                            </Button>
                        </div>
                    </Card>
                )
            }
        </>
    );
};

export default Page;
