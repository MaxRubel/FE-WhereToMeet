import { Event } from "dataTypes";
import styles from "./EventStyles.module.css";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../utils/formatDate";
import { convertClock } from "../../../../../utils/convertClock";
import { CalendarIcon, LocationIcon } from "@/components/graphics/Graphics1";
import { getDay } from "../../../../../utils/getDay";

interface props {
  event: Event;
}

const SmallEventCard = ({ event }: props) => {
  const navigate = useNavigate();
  const { startDate, endDate, startTime, endTime, location } = event;
  const { street, state, city } = location.address;

  const datesAreOk =
    typeof startDate === "string" && typeof endDate === "string";

  if (!datesAreOk) {
    return "error printing date card. Check types";
  }
  const onSameDay =
    new Date(startDate).getDate() === new Date(endDate).getDate();
  const dayOfWeekStart = startDate ? getDay(startDate) : "";
  const formattedtStartDate = startDate ? formatDate(startDate) : "";
  const dayOfWeekEnd = endDate ? getDay(endDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";
  const formattedStartTime = startTime ? convertClock(startTime) : "";
  const formattedEndTime = endTime ? convertClock(endTime) : "";

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <div className={styles.eventCard} onClick={handleClick}>
      <h2>{event.name}</h2>
      <p style={{ marginTop: "1em" }}>{event.description}</p>

      {/* ---Date Section--- */}
      {startDate && (
        <div className={styles.cardSection}>
          <div className="centered">
            <CalendarIcon size="20" />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>
              {dayOfWeekStart}, {formattedtStartDate}
              {endDate && !onSameDay && (
                <span>
                  &nbsp;-&nbsp;{dayOfWeekEnd}, {formattedEndDate}
                </span>
              )}
            </div>
            {startTime && (
              <div id="second-row">
                {formattedStartTime}
                {endTime && <span>&nbsp;-&nbsp;{formattedEndTime}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---Location Section--- */}
      {location.name && (
        <div id="location-section">
          <div className={styles.cardSection}>
            <div className="centered">
              <LocationIcon size="20" />
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{location.name}</div>
              {street && (
                <div>
                  {street}, {city}, {state}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SmallEventCard;
