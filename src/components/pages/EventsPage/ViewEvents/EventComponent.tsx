import { Event } from "dataTypes";
import styles from "./EventStyles.module.css"

interface props {
  event: Event;
}

const EventComponent = ({ event }: props) => {

  return (
    <div className={styles.eventCard}>

      {/* CARD TITLE */}
      <h2 className='group-title-row'>
        <a href={`/events/${event._id}`}>
          {event.name}
        </a>
      </h2>
      <p style={{ fontSize: ".9em" }}>{event.time}</p>
      <p style={{ marginTop: '1em' }}>{event.description}</p>
    </div>
  );
};
export default EventComponent;
// export type Event = {
//   _id: string; //primary key
//   ownerId: string; //foreign key
//   groupId: string; //foreign key

//   description: string;
//   location: Location;
//   time: string; // datetime string

//   suggestions: Location[];
//   messages: Message[];
// };
