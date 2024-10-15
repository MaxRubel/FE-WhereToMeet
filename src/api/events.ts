import { Event } from "dataTypes";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

export async function createEvent(payload:Event){
    try{
        const data = await fetch(`${endpoint}/events`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        const json = await data.json();

        return json
    }catch (error){
        console.error('the error is:',error)
    }
}

export function getUserEvents(userId: string) {
    return new Promise((resolve, reject) => {
        fetch(`${endpoint}/events/user-events/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    });
}

export function getSingleEvent(eventId: string) {
    return new Promise((resolve, reject) => {
      fetch(`${endpoint}/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
