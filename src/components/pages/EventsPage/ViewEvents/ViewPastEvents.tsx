import { useAuth } from "@/context/auth/auth";
import { useGetUserEvents } from "@/api/events";
import SmallEventCard from "./SmallEventCard";
import { Event } from "dataTypes";
import styles from "./EventStyles.module.css"

export default function ViewPastEvents() {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filteredEvents = events.filter((event: Event) =>
    new Date(event.startDate).setHours(0, 0, 0, 0) < today.getTime()
  );

  return (
    <>
      <div>
        <div className={styles.upcomingHeader}><h2>Past Events</h2></div>
        {filteredEvents.length === 0 ? (
          <div className="text-left">No events found.</div>
        ) : (
          events.map((event: Event) => (
            <SmallEventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </>
  );
}
