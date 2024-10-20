import {
  checkEventPrivacy,
  useDeleteEvent,
  useGetSingleEvent,
  useUpdateEvent,
} from "@/api/events";
import styles from "../EventStyles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import SuggestionsContainer from "./Suggestions/SuggestionsContainer";
import SuggestionForm from "./Suggestions/SuggestionForm";
import { useAuth, usePublicRoute } from "@/context/auth/auth";
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
import { useEffect, useState } from "react";
import CreateEventForm from "@/components/forms/CreateFormEvent/CreateFormEvent";
import { EditIcon } from "@/components/graphics/Graphics1";

export default function ViewSingleEvent() {

  const { user, setIsGuest, setIsPublicRoute } = useAuth()
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (!eventId) {
    console.error("no event id");
    return null;
  }

  useEffect(() => {
    checkEventPrivacy(eventId).then((data: any) => {
      if (!user) return
      if (data.isPrivate && (!user._id || user._id === "guest")) {
        setIsEnabled(false)
        setIsGuest(false);
        setIsPublicRoute(false)
      } else {
        setIsEnabled(true)
      }
    })
  }, [user, eventId])

  const { data: event, isLoading, setIsEnabled } = useGetSingleEvent(eventId);

  //@ts-ignore
  usePublicRoute(event?.private)
  const updateEvent = useUpdateEvent();
  const delEventMutation = useDeleteEvent();

  if (isLoading || !event) {
    return null;
  }

  const handleDeleteEvent = () => {
    setIsEnabled(false);
    delEventMutation.mutate(eventId, {
      onSuccess: () => {
        navigate("/events");
      },
      onError: (error: any) => {
        console.error("Failed to delete event:", error);
      },
    });
  };

  const handleUpdateEvent = (eventData: any) => {
    updateEvent.mutate(eventData, {
      onSuccess: () => {
        setIsUpdateModalOpen(false);
      },
      onError: (error: any) => {
        console.error("Failed to update your event", error);
      },
    });
  };

  const togglePrivate = (e: boolean) => {
    updateEvent.mutate({ ...event, private: e });
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
        {/* Event Title Section */}
        {user._id === event.ownerId ? (
          <div className="flex items-start justify-between">
            <div>
              <Button
                className="empty-button text-left"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                <h2 className="text-xl font-bold">{event.name}</h2>
                <EditIcon size={"20"} />
              </Button>
              <p className="text-gray-600">{event.time}</p>
              <p className="mt-4">{event.description}</p>
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
                  <Button variant="destructive" onClick={handleDeleteEvent}>
                    Yes, Delete
                  </Button>
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
              <div
                className="flex items-center space-x-2"
                style={{ marginBottom: "1em" }}
              >
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
              <div
                className="flex items-center space-x-2"
                style={{ marginBottom: "1em" }}
              >
                <Switch
                  checked={event.suggestionsEnabled}
                  onCheckedChange={toggleSuggestions}
                  id="toggle-private"
                />
                <label htmlFor="toggle-private" className="text-sm font-medium">
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
                  id="toggle-chat"
                />
                <label htmlFor="toggle-chat" className="text-sm font-medium">
                  {event.chatEnabled ? "Disable Chat" : "Enable Chat"}
                </label>
              </div>
            </div>
          )}

          {/* Update Event Modal */}
          <CreateEventForm
            isModal={true}
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            event={event}
            onUpdate={handleUpdateEvent}
          />

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
