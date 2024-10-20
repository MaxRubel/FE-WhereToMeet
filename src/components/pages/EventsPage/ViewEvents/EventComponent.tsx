import { Event } from "dataTypes";
import styles from "./EventStyles.module.css";
import { Link } from "react-router-dom";

interface props {
  event: Event;
}

const SmallEventCard = ({ event }: props) => {
  return (
    <div className={styles.eventCard}>
      {/* CARD TITLE */}
      <h2 className="group-title-row">
        <Link to={`/events/${event._id}`}>{event.name}</Link>
      </h2>
      <p style={{ fontSize: ".9em" }}>{event.time}</p>
      <p style={{ marginTop: "1em" }}>{event.description}</p>
    </div>
  );
};
export default SmallEventCard;
