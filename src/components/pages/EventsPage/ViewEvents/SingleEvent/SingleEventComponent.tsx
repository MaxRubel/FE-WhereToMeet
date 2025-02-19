import { Event } from "dataTypes";
import SuggestionsContainer from "./Suggestions/SuggestionsContainer";
import Chat from "./Chat/Chat";
import LocationCard from "./LocationCard/LocationCard";
import CalendarCard from "./CalendarCard/CalendarCard";
import SendInviteModal from "@/components/forms/SendInvite/SendInviteModal";

type Props = {
  event: Event;
};

export default function SingleEventComponent({ event }: Props) {
  return (
    <div style={{ padding: "0em 2em", paddingRight: "6em" }}>
      {/* Event Title Section */}
      <div id="info-section">
        <div className="mb-8 flex justify-between">
          <h2 className="text-xxl font-bold">{event.name}</h2>
          {!event.private && <SendInviteModal eventId={event._id} />}
        </div>
        <p className="text-left">{event.description}</p>
      </div>

      {/* ---Event Details--- */}
      <div style={{ marginTop: "3em" }}>
        <CalendarCard event={event} />
        <div style={{ marginTop: "1em" }}>
          <LocationCard location={event.location} />
        </div>
      </div>

      <div style={{ marginTop: "1em" }}>
        {/* ----Chat Container---- */}
        {event.chatEnabled && <Chat eventId={event._id} />}

        {/* ----Suggestions Container--- */}
        {event.suggestionsEnabled && <SuggestionsContainer event={event} />}
      </div>
    </div>
  );
}

//click here to view the event: http://localhost:5173/events/670f1992f5dd18c9eaf0a654?guest=true&public=true
