import { useGetEventsOfGroup } from "@/api/groups";
import styles from "./ViewSingleGroup.module.css";
import { Event } from "dataTypes";
import SmallEventCard from "../../EventsPage/ViewEvents/SmallEventCard";

type props = {
  groupId: string;
};

export default function GroupEvents({ groupId }: props) {
  const { data: events, isLoading } = useGetEventsOfGroup(groupId);

  if (isLoading || !events) {
    return null;
  }

  // Filter and sort events by upcoming
  // const now = new Date()
  // const sortedEvents = events
  //   .filter(event => new Date(event.startDate) >= now)
  //   .sort((a, b) => {
  //     const dateA = new Date(a.startDate)
  //     const dateB = new Date(b.startDate)
  //     return dateA.getTime() - dateB.getTime()
  //   })

  return (
    <div className={styles.eventsSection}>
      <div className={styles.eventHeader}>
        <h3>Events</h3>
      </div>
      <div>
        {events?.length > 0 ? (
          events.map((event: Event) => (
            <SmallEventCard event={event} key={event._id} />
          ))
        ) : (
          <div className="text-left">There are no events for this group...</div>
        )}
      </div>
    </div>
  );
}
