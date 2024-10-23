import { CalendarIcon } from "@/components/graphics/Graphics1";
import { Event } from "dataTypes";
import { getDay } from "../../../../../../../utils/getDay";
import { formatDate } from "../../../../../../../utils/formatDate";
import { convertClock } from "../../../../../../../utils/convertClock";
type props = {
  event: Event;
};

export default function CalendarCard({ event }: props) {
  const { startDate, endDate, startTime, endTime } = event;

  if (startDate !== typeof "string" || endDate !== typeof "string") {
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

  return (
    <div className="cool-card flex gap-3">
      <CalendarIcon size="20" />
      {startDate ? (
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
      ) : (
        <div style={{ fontWeight: "300" }}>No date has been added...</div>
      )}
    </div>
  );
}
