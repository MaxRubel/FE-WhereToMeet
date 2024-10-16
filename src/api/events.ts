import { Event, Suggestion} from "dataTypes";
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

//  Add Suggestion To Event
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  function updateEvent(payload: Event) {
    return fetch(`${endpoint}/events/${payload._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((resp) => resp.json());
  }

  return useMutation(updateEvent, {
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries(["events", payload._id]);
      queryClient.invalidateQueries(["events"]);
    },
  });
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
export function useAddSuggestion() {
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

export type RemoveSuggestionPayload = {
  eventId: string;
  suggestionId: string;
};

export function useRemoveSuggestion() {
  const queryClient = useQueryClient();

  async function removeSuggestion(payload: RemoveSuggestionPayload) {
    const response = await fetch(`${endpoint}/events/remove-suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to remove suggestion");
    }

    return response.json();
  }

  return useMutation(removeSuggestion, {
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries(["events", payload.eventId]);
      queryClient.invalidateQueries(["events"]);
    },
  });
}

// export type AddVotePayload = {
//   suggestionId: string;
//   userId: string;
// };

// export function useAddVote() {
//   const queryClient = useQueryClient();

//   async function addVote(payload: AddVotePayload) {
//     const response = await fetch(`${endpoint}/events/add-vote`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to add vote");
//     }

//     return response.json();
//   }

//   return useMutation(addVote, {
//     onSuccess: (_, payload) => {
//       queryClient.invalidateQueries(["events", payload.suggestionId]);
//       queryClient.invalidateQueries(["events"]);
//     },
//   });
// }

export interface ToggleVotePayload {
  suggestionId: string;
  userId: string;
}

export function useToggleVote() {
  const queryClient = useQueryClient();

  async function toggleVote(payload: ToggleVotePayload) {
    const response = await fetch(`${endpoint}/events/add-vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",        
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("failed to vote")
    }
    return response.json();
  }
  return useMutation(toggleVote, {
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["events", payload.suggestionId]);
      await queryClient.cancelQueries(["events"]);

      const previousEvent = queryClient.getQueryData<any>(["events"]);

      if (previousEvent) {
        const updatedEvent = {
          ...previousEvent,
          suggestions: previousEvent.suggestions.map((suggestion: any) => {
            if (suggestion._id === payload.suggestionId) {
              const hasVoted = suggestion.votes.some(
                (vote: any) => vote.voter === payload.userId
              );
              return {
                ...suggestion,
                votes: hasVoted
                  ? suggestion.votes.filter(
                      (vote: any) => vote.voter !== payload.userId
                    )
                  : [...suggestion.votes, { voter: payload.userId }]
              };
            }
            return suggestion;
          })
        };

        queryClient.setQueryData(["events"], updatedEvent);
      }

      return { previousEvent };
    },


    onError: (_err, _payload, context) => {
      if (context?.previousEvent) {
        queryClient.setQueryData(["events"], context.previousEvent);
      }
    },
    onSettled: (_, __, payload) => {
      queryClient.invalidateQueries(["events", payload.suggestionId]);
      queryClient.invalidateQueries(["events"]);
    },
  });
}