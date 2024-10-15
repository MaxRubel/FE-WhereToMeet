import { getSingleEvent } from "@/api/events";
import { useEffect, useState } from "react";

type props = {
    eventId: string
    setIsViewing: (view: string) => void;
  }

export default function ViewSingleEvent({ eventId, setIsViewing }: props) {
    const [singleEvent, setSingleEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (eventId) {
            setIsViewing("ViewSingleEvent");
            setIsLoading(true);
            setError(null);
            getSingleEvent(eventId)
                .then((event) => {
                    setSingleEvent(event);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching event:", err);
                    setError("Failed to fetch event details");
                    setIsLoading(false);
                });
        }
    }, [eventId, setIsViewing]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!singleEvent) return <div>No event found</div>;

    return (
        <div>
            <p>{singleEvent?.name}</p>
            <p>{singleEvent?.description}</p>
            <p>{singleEvent?.time}</p>
        </div>
    )
  
}

// export type Event = {
//     _id: string; //primary key
//     name: string;
//     ownerId: string; //foreign key
//     groupId: string; //foreign key
  
//     description: string;
//     location: Location;
//     time: string; // datetime string
  
//     suggestions: Location[];
//     messages: Message[];
//   };