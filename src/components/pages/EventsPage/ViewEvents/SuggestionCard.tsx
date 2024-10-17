import { Suggestion } from "dataTypes";
import styles from "./EventStyles.module.css";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/auth";
import { useRemoveSuggestion, useToggleVote } from "@/api/events";
import type { RemoveSuggestionPayload } from "@/api/events";

type props = {
  suggestion: Suggestion;
  iHaveVoted: boolean
};

export default function SuggestionCard({
  suggestion, iHaveVoted }: props) {
  const { user } = useAuth();
  const removeSuggestion = useRemoveSuggestion();
  const { mutate: toggleVote } = useToggleVote();

  const votedForthis =
    suggestion.votes.some((vote: any) => vote.voter === user._id)

  const handleRemove = () => {
    if (!suggestion._id) {
      console.error("oops no suggestion ID found on suggestion object");
      return;
    }

    const payload: RemoveSuggestionPayload = {
      eventId: suggestion.eventId,
      suggestionId: suggestion._id,
    };

    removeSuggestion.mutate(payload);
  };

  function handleVote() {
    toggleVote({
      suggestionId: suggestion._id!,
      userId: user._id!
    });
  }

  return (
    <div className={styles.suggestionCardContainer}>
      <div className={styles.voteBox}>
        {suggestion.votes.length}
        {suggestion.votes.length === 1 ? " vote" : " votes"}
      </div>

      {/* ----Name header---- */}
      <div>
        <h2 className={styles.suggestionnName}>
          {suggestion.name}
        </h2>
      </div>

      {/* ---Description Box---- */}
      <div>
        <p style={{ marginTop: "1em" }}>
          {suggestion.description}
        </p>
      </div>

      {/* ----Button Box ---- */}
      <div style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: 'column',
        gap: ".8em",
      }}>

        {!iHaveVoted &&
          <Button onClick={handleVote}
            style={{
              backgroundColor: "rgb(93, 66, 245)"
            }}>
            Vote
          </Button>
        }

        {iHaveVoted && votedForthis &&
          <Button onClick={handleVote}
            style={{
              backgroundColor: "rgb(93, 66, 245)"
            }}>
            Remove Vote
          </Button>}

        {user._id === suggestion.userId && (
          <Button onClick={handleRemove}
            className="secondary-button"
            style={{ color: "rgb(245, 66, 90)" }}
          >
            Remove Your Suggestion
          </Button>
        )}

      </div>
    </div>
  );
}
