import { EditIcon } from "@/components/graphics/Graphics1";
import CreateEventForm from "@/components/forms/CreateFormEvent/CreateFormEvent";


export default function EventPage() {
    return (
        <div className="profile-page-layout">
      <div className="profile-side-bar">
        <ul className="profile-list">
          <li className="profile-list-item">
            <EditIcon size="18" /> Create Event
          </li>
          <li>
            view Events
          </li>
          <li>
            Add a Person
          </li>
        </ul>
      </div>
      <div className="profile-main-form">
        <CreateEventForm />
      </div>
    </div>
        
    )
}