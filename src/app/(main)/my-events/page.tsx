"use client";


import { deleteEvent, getMyEvents } from '@/actions/event';
import EventCard from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';

const MyEventPage = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 9;

    const { data: eventsData, loading, fn: refetch } = useFetch(getMyEvents, {
        args: [page, limit],
    });
    const events = eventsData?.events || [];
    const totalPages = eventsData?.totalPages || 1;
    const { fn: deleteEventFn, loading: deleteLoading } = useFetch(deleteEvent, {
        autoFetch: false,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    const openDeleteDialog = (eventId: string) => {
        setEventToDelete(eventId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!eventToDelete) return;
        try {
            await deleteEventFn(eventToDelete);
            refetch(page, limit);
            toast.success("Event deleted successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete event");
        } finally {
            setDeleteDialogOpen(false);
            setEventToDelete(null);
        }
    };

    const handleEventClick = (eventId: string) => {
        router.push(`/my-events/${eventId}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (loading || !eventsData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Events</h1>
                        <p className="text-muted-foreground">Manage your created events</p>
                    </div>
                </div>

                {events?.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="text-6xl mb-4">📅</div>
                            <h2 className="text-2xl font-bold">No events yet</h2>
                            <p className="text-muted-foreground">
                                Create your first event and start managing attendees
                            </p>
                            <Button asChild className="gap-2">
                                <Link href="/create-event">
                                    <Plus className="w-4 h-4" />
                                    Create Your First Event
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events?.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    showActions={true}
                                    onClick={() => handleEventClick(event.id)}
                                    onDelete={openDeleteDialog}
                                />
                            ))}
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogContent className='top-[20%]'>
                                    <DialogHeader>
                                        <DialogTitle>Delete Event?</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" disabled={deleteLoading} className='disabled:opacity-50' onClick={handleDeleteConfirmed}>
                                            <Trash2 className="w-4 h-4 mr-2" /> {deleteLoading ? "Deleting..." : "Delete"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex justify-center mt-8">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => page > 1 && handlePageChange(page - 1)}
                                            aria-disabled={page === 1}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <PaginationItem key={idx}>
                                            <PaginationLink
                                                isActive={page === idx + 1}
                                                onClick={() => handlePageChange(idx + 1)}
                                                href={`?page=${idx + 1}`}
                                            >
                                                {idx + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => page < totalPages && handlePageChange(page + 1)}
                                            aria-disabled={page === totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MyEventPage