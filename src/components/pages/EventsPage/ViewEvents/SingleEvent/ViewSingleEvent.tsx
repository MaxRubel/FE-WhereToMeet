import { getSingleEvent } from "@/api/events";
import styles from "../EventStyles.module.css"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "dataTypes";
import SuggestionsContainer from "../SuggestionsContainer";
import SuggestionForm from "./SuggestionForm";
import { useAuth } from "@/context/auth/auth";
import { Switch } from "@radix-ui/react-switch";

export default function ViewSingleEvent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const { user } = useAuth();

  const { eventId } = useParams();


  const { data: event, isLoading, isError, error } = useGetSingleEvent(eventId);

  if (error) return <div>Error: {error}</div>;


  if (isLoading || !event) {
    return "";

  const isEventCreator = () => {
    if (user._id === event.ownerId) {
      return true;
    }
  }

  return (
    <div className={styles.eventContainer}>

      {/* ---Event Name----*/}
      <div>

        <h2>{event.name}</h2>

        {/* ---Description----*/}
        <p style={{ marginTop: "2em" }}>{event.description}</p>
        <p>{event.time}</p>

        <h2 >{singleEvent?.name}</h2>

        {/* ---Description----*/}
        <p style={{ marginTop: '2em' }}>
          {singleEvent?.description}
        </p>
        <p>{singleEvent?.time}</p>

      </div>

      <div style={{ marginTop: '3em' }}>
        {/* ----Add A Suggestion Button---- */}

        <SuggestionForm event={event} />

        {isEventCreator() ? (
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              checked={isFormEnabled}
              onCheckedChange={setIsFormEnabled}
              id="form-toggle"
            />
            <label htmlFor="form-toggle" className="text-sm font-medium">
              {isFormEnabled ? 'Disable Suggestions' : 'Enable Suggestions'}
            </label>
          </div>
        ) : null }

        {isFormEnabled && <SuggestionForm event={singleEvent} />}


        {/* ----Suggestions Container---- */}
        <SuggestionsContainer event={event} />
      </div>

    </div>
  );
}
