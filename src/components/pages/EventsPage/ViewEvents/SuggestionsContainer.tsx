import { Event } from "dataTypes";
import styles from "./EventStyles.module.css";
import SuggestionCard from "./SuggestionCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/auth";

interface props {
  event: Event;
}

//@ts-ignore   event will be used shortly
export default function SuggestionsContainer({ event }: props) {

  const [iHaveVoted, setIHaveVoted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setIHaveVoted(false)
    for (let i = 0; i < event.suggestions.length; i++) {
      const suggestion = event.suggestions[i]
      suggestion.votes.forEach((item) => {
        //@ts-ignore
        if (item.voter === user._id) {
          setIHaveVoted(true)
        }
      })
    }
  }, [event])

  return (
    <>
      <div className={styles.suggestionsContainer}>
        <div className={styles.headerContainer}>
          {/* <h3 style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
            Suggestions
          </h3> */}
          <div className={styles.flexSuggestions}>
            {event.suggestions.map((suggestion) => (
              <SuggestionCard
                suggestion={suggestion}
                key={suggestion._id}
                iHaveVoted={iHaveVoted}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
