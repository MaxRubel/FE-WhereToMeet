import { useDeleteEvent, useGetSingleEvent, useUpdateEvent } from "@/api/events";
import styles from "../EventStyles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import SuggestionsContainer from "./Suggestions/SuggestionsContainer";
import SuggestionForm from "./Suggestions/SuggestionForm";
import { useAuth } from "@/context/auth/auth";
import { Switch } from "@/components/ui/switch";
import Chat from "./Chat/Chat";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";


export default function ViewSingleEvent() {
  const { user } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();

  if (!eventId) {
    console.error("no event id");
    return null;
  }

  //React Query
  const { data: event, isLoading, setIsEnabled } = useGetSingleEvent(eventId);
  const updateEvent = useUpdateEvent();

  const delEventMutation = useDeleteEvent(eventId);

  // if (error) return <div>Error: {error.message}</div>;

  if (isLoading || !event) {
    return null;
  }

  const handleDeleteEvent = () => {
    setIsEnabled(false);
    delEventMutation.mutate(eventId, {
      onSuccess: () => {
        navigate("/events");
      },
      onError: (error) => {
        console.error("Failed to delete event:", error);
      },
    });
  };

  const toggleSuggestions = (e: boolean) => {
    updateEvent.mutate({ ...event, suggestionsEnabled: e });
  };

  const toggleChat = (e: boolean) => {
    updateEvent.mutate({ ...event, chatEnabled: e });
  };

  return (
    <div className={styles.eventContainer}>
      <div className="col1">
        {/* ---Event Name----*/}
        <div>
          <h2>{event.name}</h2>
          <p>{event.time}</p>

          {/* ---Description----*/}
          <p style={{ marginTop: "2em" }}>{event.description}</p>
        </div>
        {user._id === event.ownerId && (
          <div>
            {/* ----DELETE BUTTON---- */}
            <Dialog>
              <DialogTrigger style={{ marginTop: "6em" }} asChild>
                <Button className="deleteButton">Delete This Event</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-left">
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    event.
                  </DialogDescription>
                </DialogHeader>
                <div className="text-left flex gap-4">
                  <Button
                    style={{ backgroundColor: "red" }}
                    onClick={handleDeleteEvent}
                  >
                    Yes, Delete
                  </Button>
                  <DialogClose asChild>
                    <Button className="secondary-button">Cancel</Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div style={{ marginTop: "3em" }}>
          {/* ----Admin Toggle Switches---- */}
          {/* only admin creator can toggle switches */}
          {user._id === event.ownerId && (
            <div>
              {/* suggestions switch */}
              <div
                className="flex items-center space-x-2"
                style={{ marginBottom: "1em" }}
              >
                <Switch
                  checked={event.suggestionsEnabled}
                  onCheckedChange={toggleSuggestions}
                  id="toggle-suggestions"
                />
                <label
                  htmlFor="toggle-suggestions"
                  className="text-sm font-medium"
                >
                  {event.suggestionsEnabled
                    ? "Disable Suggestions"
                    : "Enable Suggestions"}
                </label>
              </div>

              {/* chat switch */}
              <div
                className="flex items-center space-x-2 mb-4"
                style={{ marginBottom: "3em" }}
              >
                <Switch
                  checked={event.chatEnabled}
                  onCheckedChange={toggleChat}
                  id="toggle-suggestions"
                />
                <label
                  htmlFor="toggle-suggestions"
                  className="text-sm font-medium"
                >
                  {event.chatEnabled ? "Disable Chat" : "Enable Chat"}
                </label>
              </div>
            </div>
          )}

          {/* ----Suggestions Container--- */}
          {event.suggestionsEnabled && (
            <>
              <SuggestionForm event={event} />{" "}
              {/* Add A Suggestion button lives here*/}
              <SuggestionsContainer event={event} />
            </>
          )}

          {/* ----Chat Container---- */}
          {event.chatEnabled && <Chat eventId={eventId} />}
        </div>
      </div>
    </div>
  );
}
