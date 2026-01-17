"use client";

import { getEventsByCategory, getEventsByLocation } from "@/actions/events";
import EventCard from "@/components/event-card";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { CATEGORIES } from "@/lib/data";
import { parseLocationSlug } from "@/utils/location";
import { Loader2, MapPin } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";

const Page = () => {
    const params = useParams();
    const router = useRouter();

    const slug = params.slug;

    const categoryInfo = CATEGORIES.find((cat) => cat.id === slug);
    const isCategory = !!categoryInfo;

    const { city, state, isValid } = !isCategory
        ? parseLocationSlug(slug as string)
        : { city: null, state: null, isValid: false };

    if (!isCategory && !isValid) {
        notFound();
    }

    const fetchFn = async (
        slug: string,
        city: string | null,
        state: string | null,
        isCategory: boolean,
        page = 1,
        limit = 10
    ) => {
        if (isCategory) {
            return getEventsByCategory(slug, page, limit);
        } else {
            return getEventsByLocation(city, state, "", page, limit);
        }
    };

    const { data: events, loading: loadingEvents } = useFetch(fetchFn, {
        args: [slug as string, city, state, isCategory, 1, 10],
    });

    const handleEventClick = (slug: string) => {
        router.push(`/events/${slug}`);
    }

    if (loadingEvents) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (isCategory) {
        return (
            <>
                <div className="pb-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-6xl">{<categoryInfo.icon />}</div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold">
                                {categoryInfo.label}
                            </h1>
                            <p className="text-lg text-muted-foreground mt-2">
                                {categoryInfo.description}
                            </p>
                        </div>
                    </div>

                    {events?.events && events.events.length > 0 && (
                        <p className="text-muted-foreground">
                            {events.events.length} event{events.events.length !== 1 ? "s" : ""} found
                        </p>
                    )}
                </div>

                {events?.events && events.events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onClick={() => handleEventClick(event.slug)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        No events found in this category.
                    </p>
                )}
            </>
        );
    }

    return (
        <>
            <div className="pb-5">
                <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">📍</div>
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold">Events in {city}</h1>
                        <p className="text-lg text-muted-foreground mt-2">{state}, India</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="gap-2">
                        <MapPin className="w-3 h-3" />
                        {city}, {state}
                    </Badge>
                    {events?.events && events.events.length > 0 && (
                        <p className="text-muted-foreground">
                            {events.events.length} event{events.events.length !== 1 ? "s" : ""} found
                        </p>
                    )}
                </div>
            </div>

            {events?.events && events.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => handleEventClick(event.slug)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">
                    No events in {city}, {state} yet.
                </p>
            )}
        </>
    );
}

export default Page