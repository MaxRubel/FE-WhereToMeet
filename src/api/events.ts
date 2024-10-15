import { Event, Suggestion } from "dataTypes";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

export async function createEvent(payload: Event) {
  try {
    const data = await fetch(`${endpoint}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await data.json();

    return json;
  } catch (error) {
    console.error("the error is:", error);
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
      .catch((err) => reject(err));
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

//  Get Single Event
export function useGetSingleEvent(
  eventId: string
): UseQueryResult<Event, Error> {
  return useQuery<Event, Error>({
    queryKey: ["events", eventId],
    queryFn: async () => {
      const response = await fetch(`${endpoint}/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    enabled: !!eventId,
  });
}

//  Add Suggestion To Event
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  function updateEvent(payload: Suggestion) {
    return fetch(`${endpoint}/events/add-suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((resp) => resp.json());
  }

  return useMutation(updateEvent, {
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries(["events", payload.eventId]);
      queryClient.invalidateQueries(["events"]);
    },
  });
}
