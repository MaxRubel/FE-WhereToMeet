import { EditIcon } from "@/components/graphics/Graphics1";
import "./CreateEvent.css";
import CreateEventForm from "@/components/forms/CreateFormEvent/CreateFormEvent";

export default function CreateEventPage() {
  return (
    <div className="event-page-layout">
      <div className="event-side-bar">
        <ul className="event-list">
          <button className="event-list-item">
            <EditIcon size="18" /> Create Event
          </button>
          <button>view Events</button>
        </ul>
      </div>
      <div className="event-main-form">
        <CreateEventForm />
      </div>
    </div>
  );
}
