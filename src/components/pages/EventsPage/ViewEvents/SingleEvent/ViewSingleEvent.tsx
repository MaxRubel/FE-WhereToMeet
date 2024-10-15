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

  const {
    data: singleEvent,
    isLoading,
    isError,
    error,
  } = useGetSingleEvent(eventId);

  if (isError) return <div>Error: {error.message}</div>;

  if (isLoading || !singleEvent) {
    return "loading";
  }

  return (
    <div className={styles.eventContainer}>
      {/* ---Event Name----*/}
      <div>
        <h2>{singleEvent.name}</h2>

        {/* ---Description----*/}
        <p style={{ marginTop: "2em" }}>{singleEvent.description}</p>
        <p>{singleEvent.time}</p>
      </div>

      <div style={{ marginTop: "3em" }}>
        {/* ----Add A Suggestion Button---- */}
        <SuggestionForm event={singleEvent} />

        {/* ----Suggestions Container---- */}
        <SuggestionsContainer event={singleEvent} />
      </div>
    </div>
  );
}
