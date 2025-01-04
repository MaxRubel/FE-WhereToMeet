import {
  AddSymbol,
  CalendarIcon,
  ViewFolders,
} from "@/components/graphics/Graphics1";
import "./EventPage.css";
import { useEffect, useState } from "react";
import CreateEventForm from "@/components/forms/CreateFormEvent/CreateFormEvent";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SingleEventLayout from "./ViewEvents/SingleEvent/SingleEventLayout";
import ViewUpcomingEvents from "./ViewEvents/ViewUpcomingEvents";
import ViewPastEvents from "./ViewEvents/ViewPastEvents";

export default function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  // set state based on URL Params:
  const creating = searchParams.get("creating") === "true";
  const [isViewing, setIsViewing] = useState(
    creating
      ? "CreateEventForm"
      : eventId
      ? "ViewSingleEvent"
      : "upcomingEvents"
  );

  useEffect(() => {
    // reset the state on URL change
    setIsViewing(
      creating
        ? "CreateEventForm"
        : eventId
        ? "ViewSingleEvent"
        : "upcomingEvents"
    );
  }, [eventId, creating]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="profile-page-layout">
      {screenWidth >= 700 && (
        <div className="profile-side-bar">
          <ul className="profile-list">
            {/* ---Create Event--- */}
            <button
              className="clear-button side-list-item"
              style={{
                fontWeight: isViewing == "CreateEventForm" ? "900" : "",
                backgroundColor:
                  isViewing == "CreateEventForm"
                    ? "rgb(245,245,245)"
                    : "transparent",
              }}
              onClick={() => {
                setIsViewing("CreateEventForm");
              }}
            >
              <AddSymbol size="20" /> Create Event
            </button>

            {/* ---View Events--- */}
            <button
              className="clear-button side-list-item"
              style={{
                fontWeight: isViewing == "upcomingEvents" ? "900" : "",
                backgroundColor:
                  isViewing == "upcomingEvents"
                    ? "rgb(245,245,245)"
                    : "transparent",
              }}
              onClick={() => {
                setIsViewing("upcomingEvents");
                navigate("/events");
              }}
            >
              <CalendarIcon size="20" /> Upcoming Events
            </button>

            {/* ---Past Events--- */}
            <button
              className="clear-button side-list-item"
              style={{
                fontWeight: isViewing == "pastEvents" ? "900" : "",
                backgroundColor:
                  isViewing == "pastEvents"
                    ? "rgb(245,245,245)"
                    : "transparent",
              }}
              onClick={() => {
                setIsViewing("pastEvents");
                navigate("/events");
              }}
            >
              <ViewFolders size="20" /> Past Events
            </button>
          </ul>
        </div>
      )}
      <div className="profile-main-form">
        {isViewing === "CreateEventForm" && <CreateEventForm />}
        {isViewing === "upcomingEvents" && <ViewUpcomingEvents />}
        {isViewing === "ViewSingleEvent" && (
          //@ts-ignore   will not be null
          <SingleEventLayout eventId={eventId} setIsViewing={setIsViewing} />
        )}
        {isViewing === "pastEvents" && <ViewPastEvents />}
      </div>
    </div>
  );
}
