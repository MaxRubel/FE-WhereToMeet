import { useGetSingleEvent, useUpdateEvent } from "@/api/events";
import styles from "../EventStyles.module.css";
import { useParams } from "react-router-dom";
import SuggestionsContainer from "../SuggestionsContainer";
import SuggestionForm from "./SuggestionForm";
import { useAuth } from "@/context/auth/auth";
import { Switch } from "@/components/ui/switch";
import Chat from "./Chat/Chat";


export default function ViewSingleEvent() {
  const { user } = useAuth();
  const { eventId } = useParams();

  if (!eventId) {
    console.error("no event id");
    return null;
  }

  const { data: event, isLoading, error } = useGetSingleEvent(eventId);
  const updateEvent = useUpdateEvent();

  if (error) return <div>Error: {error.message}</div>;

  if (isLoading || !event) {
    return null;
  }

  const handleSwitch = (e: boolean) => {
    updateEvent.mutate({ ...event, suggestionsEnabled: e });
  };

  return (
    <div className={styles.eventContainer}>

      <div className="col1">
        {/* ---Event Name----*/}
        <div>
          <h2>{event.name}</h2>
          <p>{event.time}</p>

          {/* ---Description----*/}
          <p style={{ marginTop: "2em" }}>
            {event.description}
          </p>
        </div>

        <div style={{ marginTop: "3em" }}>
          {/* ----Admin Toggle Switch---- */}
          {user._id === event.ownerId && (
            <div className="flex items-center space-x-2 mb-4"
              style={{ marginBottom: "3em" }}>
              <Switch
                checked={event.suggestionsEnabled}
                onCheckedChange={handleSwitch}
                id="form-toggle"
              />
              <label htmlFor="form-toggle" className="text-sm font-medium">
                {event.suggestionsEnabled
                  ? "Disable Suggestions"
                  : "Enable Suggestions"}
              </label>
            </div>
          )}

          {/* ----Suggestions Container--- */}
          {event.suggestionsEnabled &&
            <>
              <SuggestionForm event={event} /> {/* Add A Suggestion button lives here*/}
              <SuggestionsContainer event={event} />
            </>
          }
        </div>
      </div>

      <div className="col-2">
        <Chat eventId={eventId} />
      </div>
    </div>
  );
}