import { useDeleteEvent, useUpdateEvent } from "@/api/events";
import { Switch } from "@/components/ui/switch";
import { Event } from "dataTypes";
import styles from "../EventStyles.module.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { BackArrow } from "@/components/graphics/Graphics1";

type props = {
  event: Event;
  setIsViewing: Dispatch<SetStateAction<string>>;
};

export default function ModeratorSettings({ event, setIsViewing }: props) {
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const navigate = useNavigate();

  const togglePrivate = (e: boolean) => {
    const payload = { ...event, private: e };
    updateEvent.mutate(payload);
  };

  const toggleSuggestions = (e: boolean) => {
    const payload = { ...event, suggestionsEnabled: e };
    updateEvent.mutate(payload);
  };

  const toggleChat = (e: boolean) => {
    const payload = { ...event, chatEnabled: e };
    updateEvent.mutate(payload);
  };

  const handleDelete = () => {
    deleteEvent.mutate(event._id, {
      onSuccess: () => {
        navigate("/events");
      },
    });
  };

  return (
    <div style={{ padding: "0em 2em" }}>
      <div style={{ marginBottom: "2em" }}>
        <Button
          className={`secondary-button ${styles.backButton}`}
          onClick={() => {
            setIsViewing("singleEvent");
          }}
        >
          <BackArrow size="18" />
          Back to your event
        </Button>
      </div>
      <h2>Moderator Settings</h2>

      <div id="toggle-container" style={{ marginTop: "2em" }}>
        <div id="private container" style={{ marginBottom: "2em" }}>
          {/* ---private switch--- */}
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              checked={event.private}
              onCheckedChange={togglePrivate}
              id="toggle-private"
              style={{ padding: "0px" }}
            />
            <label htmlFor="toggle-private" className="text-sm font-medium">
              Private Event
            </label>
          </div>
          <div className={styles.subSwitch}>
            A private event can only be viewed by its group members. A public
            event is viewable by anyone with a link to the event.
          </div>
        </div>

        {/* ---suggestions switch--- */}
        <div id="suggestions-switch-container" style={{ marginTop: "2em" }}>
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              checked={event.suggestionsEnabled}
              onCheckedChange={toggleSuggestions}
              id="toggle-suggestions"
              style={{ padding: "0px" }}
            />
            <label htmlFor="toggle-suggestions" className="text-sm font-medium">
              {event.suggestionsEnabled
                ? "Disable Suggestions"
                : "Enable Suggestions"}
            </label>
          </div>
          <div className={styles.subSwitch}>
            This will disable users from creating or viewing suggestions for the
            event's location.
          </div>
        </div>

        {/* chat switch */}
        <div id="chat-switch-container" style={{ marginTop: "2em" }}>
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              checked={event.chatEnabled}
              onCheckedChange={toggleChat}
              id="toggle-chat"
              style={{ padding: "0px" }}
            />
            <label htmlFor="toggle-chat" className="text-sm font-medium">
              {event.chatEnabled ? "Disable Chat" : "Enable Chat"}
            </label>
          </div>
          <div className={styles.subSwitch}>
            This will disable the chat feature from the event page.
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <Dialog>
        <DialogTrigger asChild style={{ marginTop: "4em" }}>
          <Button variant="destructive" className="mt-2">
            Delete Event
          </Button>
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
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
