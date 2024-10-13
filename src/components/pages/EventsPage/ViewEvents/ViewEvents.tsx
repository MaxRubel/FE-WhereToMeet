import { GridLoader } from "react-spinners"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/auth";
import { getUserEvents } from "@/api/events";
import EventComponent from "./EventComponent";


export default function ViewEvents(){
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const { user } = useAuth();
    
    const getTheEvents = async () => {
        try {
            setIsLoading(true);
            const resp = await getUserEvents(user._id);
            setEvents(resp.events)
        } catch (err) {
            setErr('Failed to load events, please try again');
        } finally {
            setIsLoading(false);
        }
      };

  
    useEffect(() => {
      getTheEvents();
    }, [user._id])

    if (isLoading){
        return (
            <div> 
                <GridLoader />
            </div>
        )
    } 

    if (err) {
        return <div>{err}</div>;
    }

    return (
        <>
            <div>
                {events.length === 0 ? (
                    <div>No events found.</div>
                ) : (
                    events.map((event) => (
                        <EventComponent key={event._id} event={event} />
                    ))
                )}
            </div>
        </>
    )
}
