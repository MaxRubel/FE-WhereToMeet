import { Event, Suggestion } from "dataTypes";
import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

// Keep this function as is
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

// Update Event - Migrated to v4
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, Event>({
    mutationFn: (payload) =>
      fetch(`${endpoint}/events/${payload._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((resp) => resp.json()),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["events", payload._id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

const fetchUserEvents = async (userId: string): Promise<Event[]> => {
  const response = await fetch(`${endpoint}/events/user-events/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user events');
  }

  return response.json();
};

export function useGetUserEvents(userId: string) {
  return useQuery<Event[], Error>({
    queryKey: ['events', userId],
    queryFn: () => fetchUserEvents(userId),
    enabled: !!userId,
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

// Get Single Event
export function useGetSingleEvent(id: string) {
  const [isEnabled, setIsEnabled] = useState(false);

  const query = useQuery<Event, Error>({
    queryKey: ["events", id],
    queryFn: async () => {
      const response = await fetch(`${endpoint}/events/${id}`, {
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
    enabled: !!id && isEnabled,
  });
  return { ...query, setIsEnabled };
}

// Delete Event - Migrated to v4
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`${endpoint}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["events", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Add Suggestion To Event - Migrated to v4
export function useAddSuggestion() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, Suggestion>({
    mutationFn: (payload) =>
      fetch(`${endpoint}/events/add-suggestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((resp) => resp.json()),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["events", payload.eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export type RemoveSuggestionPayload = {
  eventId: string;
  suggestionId: string;
};

// Remove Suggestion - Migrated to v4
export function useRemoveSuggestion() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, RemoveSuggestionPayload>({
    mutationFn: async (payload) => {
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
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["events", payload.eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export interface ToggleVotePayload {
  suggestionId: string;
  userId: string;
}

// Toggle Vote - Migrated to v4
export function useToggleVote() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, ToggleVotePayload>({
    mutationFn: async (payload) => {
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
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["events", payload.suggestionId] });
      await queryClient.cancelQueries({ queryKey: ["events"] });

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
    onSettled: (_, __, payload) => {
      queryClient.invalidateQueries({ queryKey: ["events", payload.suggestionId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Keep this function as is
export async function checkEventPrivacy(id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/events/check-privacy/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}