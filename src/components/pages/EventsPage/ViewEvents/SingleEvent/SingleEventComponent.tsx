import { useAuth } from "@/context/auth/auth";
import { Event } from "dataTypes";
import SuggestionForm from "./Suggestions/SuggestionForm";
import SuggestionsContainer from "./Suggestions/SuggestionsContainer";
import Chat from "./Chat/Chat";

type Props = {
  event: Event;
};

export default function SingleEventComponent({ event }: Props) {
  const { user } = useAuth();

  return (
    <div style={{ padding: "0em 3em" }}>
      {/* Event Title Section */}
      {user._id === event.ownerId ? (
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{event.name}</h2>

            <p className="text-gray-600">{event.time}</p>
            <p className="text-left">{event.description}</p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold">{event.name}</h2>
          <p className="text-gray-600">{event.time}</p>
          <p className="mt-4">{event.description}</p>
        </div>
      )}

      <div style={{ marginTop: "3em" }}>
        {/* ----Admin Toggle Switches---- */}
        {/* only admin creator can toggle switches */}

        {/* ---private event switch--- */}
        {/* ----Suggestions Container--- */}
        {event.suggestionsEnabled && (
          <>
            <SuggestionForm event={event} />
            <SuggestionsContainer event={event} />
          </>
        )}

        {/* ----Chat Container---- */}
        {event.chatEnabled && <Chat eventId={event._id} />}
      </div>
    </div>
  );
}

//click here to view the event: http://localhost:5173/events/670f1992f5dd18c9eaf0a654?guest=true
