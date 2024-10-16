import { useGetSingleEvent } from "@/api/events";
import styles from "../EventStyles.module.css";
import { useParams } from "react-router-dom";
import SuggestionsContainer from "../SuggestionsContainer";
import SuggestionForm from "./SuggestionForm";

export default function ViewSingleEvent() {
  const { eventId } = useParams();
  if (!eventId) {
    return "Error: No Event ID found";
  }

  const { data: event, isLoading, isError, error } = useGetSingleEvent(eventId);

  if (isError) return <div>Error: {error.message}</div>;

  if (isLoading || !event) {
    return "loading";
  }

  return (
    <div className={styles.eventContainer}>
      {/* ---Event Name----*/}
      <div>
        <h2>{event.name}</h2>

        {/* ---Description----*/}
        <p style={{ marginTop: "2em" }}>{event.description}</p>
        <p>{event.time}</p>
      </div>

      <div style={{ marginTop: "3em" }}>
        {/* ----Add A Suggestion Button---- */}
        <SuggestionForm event={event} />

        {/* ----Suggestions Container---- */}
        <SuggestionsContainer event={event} />
      </div>
    </div>
  );
}
