import { useAuth } from "@/context/auth/auth";
import style from "./home.module.css";
import { useGetUserEvents } from "@/api/events";
import { Event } from "dataTypes";
import SmallEventCard from "../pages/EventsPage/ViewEvents/SmallEventCard";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";

export default function Home() {
  const { user } = useAuth();
  const { data, isLoading } = useGetUserEvents(user._id);
  const navigate = useNavigate();

  if (isLoading) {
    return <GridLoader />;
  }

  //@ts-ignore
  const upcomingEvents = data?.events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    eventDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return eventDate >= now;
  });

  return (
    <div id="home-page-container" className={style.homePageContainer}>
      <div className={style.content}>
        {/* fixed section */}
        <div className={`${style.announcementsContainer} centered`}>
          <img
            src="beardedDudes.jpeg"
            alt=""
            style={{ objectFit: "cover", width: "100%" }}
          />
        </div>

        {/* 2nd Section */}
        <div className={style.lowerSection}>
          <h2 style={{ paddingBottom: "1em" }}>Your Upcoming Events</h2>
          <div>
            {upcomingEvents?.length > 0 ? (
              upcomingEvents.map((event: Event) => (
                <SmallEventCard event={event} key={event._id} />
              ))
            ) : (
              <div className="flex flex-col justify-center">
                <div>It looks like you have no upcoming events...</div>
                <div style={{ marginTop: "2em" }}>
                  <Button
                    style={{ width: "200px" }}
                    className="secondary-button"
                    onClick={() => {
                      navigate("/events?creating=true");
                    }}
                  >
                    Why not create one?
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
