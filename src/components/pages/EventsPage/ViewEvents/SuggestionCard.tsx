import { Suggestion } from "dataTypes";
import styles from "./EventStyles.module.css";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/auth";
import { useRemoveSuggestion, useToggleVote } from "@/api/events";
import type { RemoveSuggestionPayload } from "@/api/events";

type props = {
  suggestion: Suggestion;
};

export default function SuggestionCard({ suggestion }: props) {
  const { user } = useAuth();
  const removeSuggestion = useRemoveSuggestion();
  const { mutate: toggleVote } = useToggleVote();

  const hasVoted = suggestion.votes.some((vote: any) => vote.voter === user._id)

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
      <div>
        <h2 className={styles.suggestionnName}>{suggestion.name}</h2>
      </div>
      <div>
        <p style={{ marginTop: "1em" }}>{suggestion.description}</p>
      </div>
      <div>
        <p>Votes: {suggestion.votes.length}</p> 
      </div>
      <div>
        {user._id === suggestion.userId && (
          <>
            <Button onClick={handleVote}>
              {hasVoted ? 'Remove Vote' : 'Add Vote'}
            </Button>
            <Button onClick={handleRemove}>Remove Suggestion</Button>
          </>
        )}
      </div>
    </div>
  );
}
