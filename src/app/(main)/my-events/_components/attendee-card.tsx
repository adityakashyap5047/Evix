import { checkedInAttendee } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { Registration } from "@/lib/Type";
import { format } from "date-fns";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function AttendeeCard({ registration, onCheckIn }: { registration: Registration, onCheckIn?: (reg: Registration) => void }) {
  const {fn: checkedInAttendeeFn, loading, data} = useFetch(checkedInAttendee, {
    autoFetch: false
  });

  const [localReg, setLocalReg] = useState(registration);

  useEffect(() => {
    setLocalReg(registration);
  }, [registration]);

  const handleManualCheckIn = async () => {
    try {
      await checkedInAttendeeFn(localReg.qrCode);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to check in attendee");
    }
  };

  if(data?.status === 200 && !localReg.checkedIn){
    toast.success("Attendee checked in successfully");
    setLocalReg(data.registration);
    if (onCheckIn) onCheckIn(data.registration);
  }

  return (
    <Card className="py-0">
      <CardContent className="p-4 flex items-start gap-4">
        <div
          className={`mt-1 p-2 rounded-full ${
            localReg.checkedIn ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {localReg.checkedIn ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{localReg.attendeeName}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {localReg.attendeeEmail}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>
              {localReg.checkedIn ? "⏰ Checked in" : "📅 Registered"}{" "}
              {localReg.checkedIn && localReg.checkedInAt
                ? format(localReg.checkedInAt, "PPp")
                : format(localReg.registeredAt, "PPp")}
            </span>
            <span className="font-mono">QR: {localReg.qrCode}</span>
          </div>
        </div>

        {!localReg.checkedIn ? (
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