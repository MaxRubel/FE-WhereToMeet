import { useAuth } from "@/context/auth/auth";
import { useGetUserEvents } from "@/api/events";
import SmallEventCard from "./SmallEventCard";
import { Event } from "dataTypes";

export default function ViewEvents() {
  const { user } = useAuth();

  const { data, isLoading, error } = useGetUserEvents(user._id);

  if (isLoading || !data) {
    return null;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  //@ts-ignore
  const { events } = data;
  return (
    <>
      <div>
        {events.length === 0 ? (
          <div>No events found.</div>
        ) : (
          events.map((event: Event) => (
            <SmallEventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </>
  );
}
