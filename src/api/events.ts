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