import { checkedInAttendee } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { Registration } from "@/lib/Type";
import { format } from "date-fns";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AttendeeCard({ registration }: { registration: Registration }) {
  const {fn: checkedInAttendeeFn, loading, data} = useFetch(checkedInAttendee, {
    autoFetch: false
  });

  const [isCheckedIn, setIsCheckedIn] = useState(registration.checkedIn);

  const handleManualCheckIn = async () => {
    try {
      await checkedInAttendeeFn(registration.qrCode);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to check in attendee");
    }
  };

  if (data?.status === 200 && !isCheckedIn) {
    setIsCheckedIn(true);
    toast.success("Attendee checked in successfully");
  }

  return (
    <Card className="py-0">
      <CardContent className="p-4 flex items-start gap-4">
        <div
          className={`mt-1 p-2 rounded-full ${
            registration.checkedIn ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {registration.checkedIn ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{registration.attendeeName}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {registration.attendeeEmail}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>
              {registration.checkedIn ? "⏰ Checked in" : "📅 Registered"}{" "}
              {registration.checkedIn && registration.checkedInAt
                ? format(registration.checkedInAt, "PPp")
                : format(registration.registeredAt, "PPp")}
            </span>
            <span className="font-mono">QR: {registration.qrCode}</span>
          </div>
        </div>

        {!isCheckedIn ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualCheckIn}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Check In
              </>
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualCheckIn}
            disabled={true}
            className="gap-2 disabled:opacity-100"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            Checked In
          </Button>
        )} 
      </CardContent>
    </Card>
  );
}