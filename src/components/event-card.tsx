import React from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { getCategoryIcon, getCategoryLabel } from '@/lib/data'
import { format } from 'date-fns'
import { Calendar, MapPin, Trash2, Users } from 'lucide-react'
import { Event } from '@/lib/Type'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface EventCardProps {
    event: Event;
    onClick: () => void;
    showActions?: boolean;
    onDelete?: (id: string) => void;
    variant?: 'grid' | 'list';
    className?: string;
}

const EventCard = ({
    event,
    onClick,
    showActions = false,
    onDelete,
    variant = "grid",
    className = "",
}: EventCardProps) => {
    if (variant === "list") {
        return (
            <Card
                className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50 ${className}`}
                onClick={onClick}
            >
                <CardContent className="p-3 flex gap-3">
                    {/* Event Image */}
                    <div className="w-20 h-20 rounded-md shrink-0 overflow-hidden relative">
                        {event.coverImageUrl ? (
                            <Image
                                src={event.coverImageUrl}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div
                                className="absolute inset-0 flex items-center justify-center text-3xl"
                                style={{ backgroundColor: event.themeColor ?? "#888888" }}
                            >
                                {React.createElement(getCategoryIcon(event.category), {})}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
                            {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">
                            {format(event.startDate, "EEE, dd MMM, HH:mm")}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">
                                {event.locationType === "ONLINE" ? "Online Event" : event.city}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{event.registrationCount} attending</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card
            className={`overflow-hidden group pt-0 flex flex-col min-h-105 ${!!onClick ? "cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50" : ""} ${className}`}
            onClick={onClick}
            style={{ height: '100%' }}
        >
            <div className="relative h-48 overflow-hidden">
                {event.coverImageUrl ? (
                    <Image
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        width={500}
                        height={192}
                        priority
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ backgroundColor: event.themeColor ?? "#888888" }}
                    >
                        {React.createElement(getCategoryIcon(event.category), {})}
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary">
                        {event.ticketType === "FREE" ? "Free" : "Paid"}
                    </Badge>
                </div>
            </div>

            <CardContent className="space-y-3 flex flex-col flex-1">
                <div>
                    <Badge variant="outline" className="mb-2">
                        {React.createElement(getCategoryIcon(event.category), {})} {getCategoryLabel(event.category)}
                    </Badge>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {event.title}
                    </h3>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(event.startDate, "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">
                            {event.locationType === "ONLINE"
                                ? "Online Event"
                                : `${event.city}, ${event.state || event.country}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                            {event.registrationCount} / {event.capacity} registered
                        </span>
                    </div>
                </div>

                <div className="flex-1" />
                {showActions && (
                    <div className="flex gap-2 pt-2 mt-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.();
                            }}
                        >
                            view
                        </Button>

                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(event.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default EventCard