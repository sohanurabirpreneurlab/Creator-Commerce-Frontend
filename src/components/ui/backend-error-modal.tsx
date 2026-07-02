import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  backendErrorEventName,
  type BackendErrorDetail,
} from "@/lib/backend-error-events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BackendErrorModal() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleBackendError = (event: Event) => {
      const { detail } = event as CustomEvent<BackendErrorDetail>;
      setMessage(detail.message);
    };

    window.addEventListener(backendErrorEventName, handleBackendError);
    return () => {
      window.removeEventListener(backendErrorEventName, handleBackendError);
    };
  }, []);

  return (
    <Dialog open={Boolean(message)} onOpenChange={(open) => !open && setMessage(null)}>
      <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Something went wrong</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button type="button" onClick={() => setMessage(null)}>
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
