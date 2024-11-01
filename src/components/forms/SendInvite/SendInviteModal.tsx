import {
  addInviteEmailtoDB,
  checkInvitedEmail,
  useSendInvite,
} from "@/api/events";
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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  eventId: string;
};

type RespType = {
  success: boolean;
  message: string;
};

export default function SendInviteModal({ eventId }: Props) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const sendInvite = useSendInvite();
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState("");

  useEffect(() => {
    // clear the dialog on open / close
    setEmail("");
    setError("");
  }, [isOpen]);

  const sendInviteFunc = async () => {
    sendInvite.mutate(
      { eventId, inviteeEmail: email, inviterEmail: user.email },
      {
        onSuccess: () => {
          addInviteEmailtoDB({ email, eventId });
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await checkInvitedEmail({
        email,
        eventId,
      });
      const check = response as RespType;
      if (check.success) {
        sendInviteFunc();
      } else {
        setError("This person has already been invited.");
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    const { value } = e.target;
    setEmail(value);
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
              onChange={handleChange}
              placeholder="Enter email address"
              className="text-black"
              disabled={sendInvite.isPending}
            />
          </div>
          {sendInvite.isError && (
            <span className="text-sm text-red-500">
              {sendInvite.error instanceof Error
                ? sendInvite.error.message
                : "An error occurred"}
            </span>
          )}
          {error && <span style={{ color: "red" }}>{error}</span>}
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
