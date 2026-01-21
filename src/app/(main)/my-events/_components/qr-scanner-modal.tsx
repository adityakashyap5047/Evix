"use client";

import { useState, useEffect, useCallback } from "react";
import { QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useFetch from "@/hooks/use-fetch";
import { checkedInAttendee } from "@/actions/event";
import type { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScannerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [scannerReady, setScannerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {fn: checkedInAttendeeFn, data} = useFetch(checkedInAttendee, {
    autoFetch: false,
  })

  const handleCheckIn = useCallback(async (qrCode: string) => {
    try {
      await checkedInAttendeeFn(qrCode);

      if (data?.status === 200) {
        toast.success("Check-in successful!");
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid QR code");
    }
  }, [checkedInAttendeeFn, data, onClose]);

  // Initialize QR Scanner
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    let mounted = true;

    const initScanner = async () => {
      if (!isOpen) return;

      try {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (permError) {
          console.error("Camera permission denied:", permError);
          setError("Camera permission denied. Please enable camera access.");
          return;
        }

        const { Html5QrcodeScanner } = await import("html5-qrcode");

        if (!mounted) return;

        scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            videoConstraints: {
              facingMode: "environment",
            },
          },
          /* verbose= */ false
        );

        const onScanSuccess = (decodedText: string) => {
          if (scanner) {
            scanner.clear().catch(console.error);
          }
          handleCheckIn(decodedText);
        };

        const onScanError = (error: string) => {
          if (error && !error.includes("NotFoundException")) {
            console.debug("Scan error:", error);
          }
        };

        scanner.render(onScanSuccess, onScanError);
        setScannerReady(true);
        setError(null);
      } catch (error) {
        console.error("Failed to initialize scanner:", error);
        setError(`Failed to start camera: ${error instanceof Error ? error.message : String(error)}`);
        toast.error("Camera failed. Please use manual entry.");
      }
    };

    initScanner();

    return () => {
      mounted = false;
      if (scanner) {
        scanner.clear().catch(console.error);
      }
      setScannerReady(false);
    };
  }, [isOpen, handleCheckIn]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" />
            Check-In Attendee
          </DialogTitle>
          <DialogDescription>
            Scan QR code or enter ticket ID manually
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <>
            <div
              id="qr-reader"
              className="w-full"
              style={{ minHeight: "350px" }}
            ></div>
            {!scannerReady && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Starting camera...
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              {scannerReady
                ? "Position the QR code within the frame"
                : "Please allow camera access when prompted"}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}