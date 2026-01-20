"use client";

import { cancelRegistration, getMyRegistrations } from "@/actions/registration";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { Calendar, Loader2, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import QrCode from "react-qr-code"
import { Registration } from "@/lib/Type";

const TicketPage = () => {
    const [selectedTicket, setSelectedTicket] = useState<Registration | null>(null);

    const {data: registrationsData, loading, fn: refetchRegistrations} = useFetch(getMyRegistrations);
    const registrations = registrationsData?.registrations || [];

    const {fn: cancelRegistrationFn, loading: cancelLoading} = useFetch(cancelRegistration, {
        autoFetch: false,
    })
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [registrationToCancel, setRegistrationToCancel] = useState<string | null>(null);

  const openCancelDialog = (registrationId: string) => {
    setRegistrationToCancel(registrationId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirmed = async () => {
    if (!registrationToCancel) return;
    try {
      await cancelRegistrationFn(registrationToCancel);
      toast.success("Registration cancelled successfully.");
      setCancelDialogOpen(false);
      setRegistrationToCancel(null);
      refetchRegistrations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel registration");
    }
  };

  if (loading) {
      return (
          <div className="fixed inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
      );
  }

  const now = new Date();

  const upcomingTickets = registrations?.filter(
    (reg) =>
      reg.event && reg.event.startDate >= now && reg.status === "CONFIRMED"
  );
  const pastTickets = registrations?.filter(
    (reg) =>
      reg.event && (reg.event.startDate < now || reg.status === "CANCELLED")
  );

    return (
    <div className="pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your event registrations
          </p>
        </div>

        {upcomingTickets?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((registration) => (
                <EventCard
                  key={registration.id}
                  event={registration.event}
                  showActions={true}
                  onClick={() => setSelectedTicket(registration as Registration)}
                  onDelete={() => openCancelDialog(registration.id)}
                />
              ))}
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="top-[20%]">
                  <DialogHeader>
                    <DialogTitle>Cancel Registration?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this registration? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">No, keep registration</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleCancelConfirmed} disabled={cancelLoading} className="disabled:opacity-50">
                      {cancelLoading ? "Cancelling..." : "Cancel Registration"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {pastTickets?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((registration) => (
                <EventCard
                  key={registration.id}
                  event={registration.event}
                  showActions={false}
                  className="opacity-60"
                  onClick={() => null}
                />
              ))}
            </div>
          </div>
        )}

        {!upcomingTickets?.length && !pastTickets?.length && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🎟️</div>
              <h2 className="text-2xl font-bold">No tickets yet</h2>
              <p className="text-muted-foreground">
                Register for events to see your tickets here
              </p>
              <Button asChild className="gap-2">
                <Link href="/explore">
                  <Ticket className="w-4 h-4" /> Browse Events
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {selectedTicket && (
        <Dialog
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Ticket</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold mb-1">
                  {selectedTicket.attendeeName}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedTicket.event.title}
                </p>
              </div>

              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QrCode value={selectedTicket.qrCode} size={200} level="H" />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                <p className="font-mono text-sm">{selectedTicket.qrCode}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(selectedTicket.event.startDate, "PPP, h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedTicket.event.locationType === "ONLINE"
                      ? "Online Event"
                      : `${selectedTicket.event.city}, ${
                          selectedTicket.event.state ||
                          selectedTicket.event.country
                        }`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Show this QR code at the event entrance for check-in
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default TicketPage