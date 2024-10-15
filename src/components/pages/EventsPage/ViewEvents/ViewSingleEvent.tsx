import { getSingleEvent } from "@/api/events";
import { useAuth } from "@/context/auth/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewSingleEvent() {
  const [singleEvent, setSingleEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { eventId } = useParams();

  console.log(eventId);

  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      setError(null);
      console.log("fetching");
      getSingleEvent(eventId)
        .then((event) => {
          //@ts-ignore
          setSingleEvent(event);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching event:", err);
          setError("Failed to fetch event details");
          setIsLoading(false);
        });
    }
  }, [eventId]);

  const event = {
    suggestions: [
      { id: "123123", name: "suggestion1", votes: ["asdad, asdasd"] },
      { id: "123124", name: "suggestion2", votes: ["asdad, asdasd"] },
      { id: "123125", name: "suggestion3", votes: ["asdad, asdasd"] },
      { id: "123126", name: "suggestion4", votes: ["asdad, asdasd"] },
    ],
  };

  const addVote = () => {
    const user = useAuth();

    for (let i = 0; i < event.suggestions.length; i++) {
      const suggestion = event.suggestions[i];
      suggestion.votes.forEach((userId) => {
        if (userId === user._id) {
          console.log("Sorry! You have already voted.");
          return;
        }
      });
    }
    // payload = {suggestionId: suggestionId}
    // events/eventId/add-vote/userID
    // POST
    // body: suggestionID, userID
    // query: go into the suggestions array, find the suggestion by Id,
    // add UserID into the array
    // refetch
  };

  const addVote2 = () => {
    votes.forEach((vote) => {
      if (vote.userId === user._id) {
        return;
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!singleEvent) return <div>No event found</div>;

  if (isLoading) {
    return "";
  }

  return (
    <div>
      <p>{singleEvent?.name}</p>
      <p>{singleEvent?.description}</p>
      <p>{singleEvent?.time}</p>
    </div>
  );
}
