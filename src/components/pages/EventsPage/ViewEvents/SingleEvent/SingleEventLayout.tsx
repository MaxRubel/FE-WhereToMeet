import {
  checkEventPrivacy,
  // useDeleteEvent,
  useGetSingleEvent,
  // useUpdateEvent,
} from "@/api/events";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, usePublicRoute } from "@/context/auth/auth";
import { useEffect, useState } from "react";
import { BackArrow, EditIcon2, ModeratorIcon } from "@/components/graphics/Graphics1";
import SingleEventComponent from "./SingleEventComponent";
import CreateEventForm from "@/components/forms/CreateFormEvent/CreateFormEvent";
import ModeratorSettings from "./ModeratorSettings";

export default function SingleEventLayout() {

  const { user, setIsGuest, setIsPublicRoute } = useAuth()
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isViewing, setIsViewing] = useState("singleEvent")

  if (!eventId) {
    console.error("no event id");
    return null;
  }

  useEffect(() => {
    checkEventPrivacy(eventId).then((data: any) => {
      if (!user) return
      if (data.isPrivate && (!user._id || user._id === "guest")) {
        setIsEnabled(false)
        setIsGuest(false);
        setIsPublicRoute(false)
      } else {
        setIsEnabled(true)
      }
    })
  }, [user, eventId])

  const { data: event, isLoading, setIsEnabled } = useGetSingleEvent(eventId);

  //@ts-ignore
  usePublicRoute(event?.private)

  if (isLoading || !event) {
    return null;
  }

  // const handleDeleteEvent = () => {
  //   setIsEnabled(false);
  //   delEventMutation.mutate(eventId, {
  //     onSuccess: () => {
  //       navigate("/events");
  //     },
  //     onError: (error: any) => {
  //       console.error("Failed to delete event:", error);
  //     },
  //   });
  // };

  return (
    <div className="profile-page-layout" style={{ textAlign: 'left' }}>
      <div className="profile-side-bar">
        <ul className="profile-list">

          {/* ---View Events (back) Button---- */}
          <button
            className="clear-button side-list-item"
            onClick={() => { navigate('/events') }}
          >
            <BackArrow size="18" />
            View Events
          </button>

          {/* ---Edit Event Button--- */}
          <button
            className="clear-button side-list-item"
            onClick={() => { setIsViewing('editEvent') }}
            style={{
              backgroundColor: isViewing === "editEvent"
                ? "rgb(245,245,245)"
                : "white"
            }}
          >
            <EditIcon2 size="18" />
            Edit Event
          </button>

          {/* ---Edit Event Button--- */}
          <button
            className="clear-button side-list-item"
            onClick={() => { setIsViewing('moderatorSettings') }}
          >
            <ModeratorIcon size="18" />
            Moderator Settings
          </button>
        </ul>
      </div>



      {isViewing === "singleEvent" &&
        <SingleEventComponent event={event} />
      }

      {isViewing === "editEvent" &&
        <CreateEventForm
          event={event}
          setIsViewing={setIsViewing}
        />}
      {isViewing === "moderatorSettings" &&
        <ModeratorSettings />}
    </div>
  );
}
