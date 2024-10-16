import { useGetSingleEvent } from "@/api/events";
import styles from "../EventStyles.module.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SuggestionsContainer from "../SuggestionsContainer";
import SuggestionForm from "./SuggestionForm";
import { useAuth } from "@/context/auth/auth";
import { Switch } from "@/components/ui/switch";

export default function ViewSingleEvent() {
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const { user } = useAuth();
  const { eventId } = useParams();

  if (!eventId) {
    console.error("no event id");
    return;
  }

  const { data: event, isLoading, error } = useGetSingleEvent(eventId);

  if (error) return <div>Error: {error.message}</div>;

  if (isLoading || !event) {
    return "";
  }

  return (
    <div className={styles.eventContainer}>
      {/* ---Event Name----*/}
      <div>
        <h2>{event.name}</h2>

        {/* ---Description----*/}
        <p style={{ marginTop: "2em" }}>{event.description}</p>
        <p>{event.time}</p>

        {/* ---Description----*/}
        <p style={{ marginTop: "2em" }}>{event.description}</p>
        <p>{event.time}</p>
      </div>

      <div style={{ marginTop: "3em" }}>
        {/* ----Add A Suggestion Button---- */}

        {user._id === event.ownerId && (
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              checked={isFormEnabled}
              onCheckedChange={setIsFormEnabled}
              id="form-toggle"
            />
            <label htmlFor="form-toggle" className="text-sm font-medium">
              {isFormEnabled ? "Disable Suggestions" : "Enable Suggestions"}
            </label>
          </div>
        )}

        {isFormEnabled && <SuggestionForm event={event} />}

        {/* ----Suggestions Container---- */}
        <SuggestionsContainer event={event} />
      </div>
    </div>
  );
}
