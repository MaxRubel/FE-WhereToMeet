// import { GridLoader } from "react-spinners"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/auth";
import { getUserEvents } from "@/api/events";
import EventComponent from "./EventComponent";


export default function ViewEvents(){
    const [events, setEvents] = useState<Event[]>([]);
    const { user } = useAuth();
    
    const getTheEvents = () => {
      getUserEvents(user._id).then((resp) => {
        setEvents(resp.events)
      });
    }
    console.warn(events);
  
    useEffect(() => {
      getTheEvents();
    }, [])

    return (
        <>
            {/* <div>
                <GridLoader />
            </div> */}
            <div>
                {events?.map((event) => (
                    <EventComponent key={event._id} event={event} />
                ))}
            </div>
        </>
    )
}
