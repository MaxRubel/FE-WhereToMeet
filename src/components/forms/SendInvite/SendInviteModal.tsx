import { useSendInvite } from "@/api/events";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  eventId: string;
};

export default function SendInviteModal({ eventId }: Props) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const sendInvite = useSendInvite();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    sendInvite.mutate(
      { eventId, inviteeEmail: email, inviterEmail: user.email },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Invitation sent successfully.",
            className: "toastty",
          });
          setEmail("");
          setIsOpen(false);
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Failed to send invitation",
            variant: "destructive",
            className: "toastty",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Send Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send an Invite?</DialogTitle>
          <DialogDescription>
            Let someone know about your event!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4 mt-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="text-black"
              disabled={sendInvite.isPending}
            />
          </div>
          {sendInvite.isError && (
            <p className="text-sm text-red-500">
              {sendInvite.error instanceof Error
                ? sendInvite.error.message
                : "An error occurred"}
            </p>
          )}
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 w-full"
            disabled={sendInvite.isPending}
          >
            {sendInvite.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
