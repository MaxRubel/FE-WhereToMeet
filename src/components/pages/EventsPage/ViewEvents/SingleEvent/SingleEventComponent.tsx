import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth/auth";
import { Event } from "dataTypes";
import SuggestionForm from "./Suggestions/SuggestionForm";
import SuggestionsContainer from "./Suggestions/SuggestionsContainer";
import Chat from "./Chat/Chat";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  event: Event;
};

export default function SingleEventComponent({ event }: Props) {
  const { user } = useAuth();

  // Placeholder functions
  const togglePrivate = (checked: boolean) => {
    // Logic to toggle private event
  };

  const toggleSuggestions = (checked: boolean) => {
    // Logic to toggle suggestions
  };

  const toggleChat = (checked: boolean) => {
    // Logic to toggle chat
  };

  return (
    <div style={{ padding: '0em 3em' }}>
      {/* Event Title Section */}
      {user._id === event.ownerId ? (
        <div className="flex items-start justify-between">
          <div>

            <h2 className="text-xl font-bold">
              {event.name}
            </h2>

            <p className="text-gray-600">{event.time}</p>
            <p className="text-left">{event.description}</p>
          </div>

          {/* Delete Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-2">
                Delete Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-left">
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your event.
                </DialogDescription>
              </DialogHeader>
              <div className="text-left flex gap-4">
                <Button variant="destructive">Yes, Delete</Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold">{event.name}</h2>
          <p className="text-gray-600">{event.time}</p>
          <p className="mt-4">{event.description}</p>
        </div>
      )}

      <div style={{ marginTop: "3em" }}>
        {/* ----Admin Toggle Switches---- */}
        {/* only admin creator can toggle switches */}
        {/* ---private event switch--- */}
        {user._id === event.ownerId && (
          <div>
            <div className="flex items-center space-x-2" style={{ marginBottom: "1em" }}>
              <Switch
                checked={event.private}
                onCheckedChange={togglePrivate}
                id="toggle-private"
              />
              <label htmlFor="toggle-private" className="text-sm font-medium">
                Private Event
              </label>
            </div>

            {/* ---suggestions switch--- */}
            <div className="flex items-center space-x-2" style={{ marginBottom: "1em" }}>
              <Switch
                checked={event.suggestionsEnabled}
                onCheckedChange={toggleSuggestions}
                id="toggle-suggestions"
              />
              <label htmlFor="toggle-suggestions" className="text-sm font-medium">
                {event.suggestionsEnabled ? "Disable Suggestions" : "Enable Suggestions"}
              </label>
            </div>

            {/* chat switch */}
            <div className="flex items-center space-x-2 mb-4" style={{ marginBottom: "3em" }}>
              <Switch
                checked={event.chatEnabled}
                onCheckedChange={toggleChat}
                id="toggle-chat"
              />
              <label htmlFor="toggle-chat" className="text-sm font-medium">
                {event.chatEnabled ? "Disable Chat" : "Enable Chat"}
              </label>
            </div>
          </div>
        )}

        {/* ----Suggestions Container--- */}
        {event.suggestionsEnabled && (
          <>
            <SuggestionForm event={event} />
            <SuggestionsContainer event={event} />
          </>
        )}

        {/* ----Chat Container---- */}
        {event.chatEnabled && <Chat eventId={event._id} />}
      </div>
    </div>
  );
}
