import { AddSymbol, ViewFolders } from "@/components/graphics/Graphics1";
import "./EventPage.css";
import { useState } from "react";
import CreateEventForm from "@/components/forms/CreateFormEvent/CreateFormEvent";
import ViewEvents from "./ViewEvents/ViewEvents";
import { useNavigate, useParams } from "react-router-dom";
import SingleEventLayout from "./ViewEvents/SingleEvent/SingleEventLayout";

export default function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isViewing, setIsViewing] = useState(
    eventId ? "ViewSingleEvent" : "ViewEvents"
  );

  return (
    <div className="profile-page-layout">
      <div className="profile-side-bar">
        <ul className="profile-list">
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
          <button
            className="clear-button side-list-item"
            style={{
              fontWeight: isViewing == "ViewEvents" ? "900" : "",
              backgroundColor:
                isViewing == "ViewEvents" ? "rgb(245,245,245)" : "transparent",
            }}
            onClick={() => {
              setIsViewing("ViewEvents");
              navigate("/events");
            }}
          >
            <ViewFolders size="20" /> View Events
          </button>
        </ul>
      </div>
      <div className="profile-main-form">
        {isViewing == "CreateEventForm" && <CreateEventForm />}
        {isViewing == "ViewEvents" && <ViewEvents />}
        {isViewing == "ViewSingleEvent" && (
          //@ts-ignore   will not be null
          <SingleEventLayout eventId={eventId} setIsViewing={setIsViewing} />
        )}
      </div>
    </div>
  );
}
