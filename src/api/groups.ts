import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Group } from "dataTypes";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

export type AddUserPayload = {
  groupId: string;
  memberId: string;
};

// Get Single Group By ID
export function useGetSingleGroup(id: string) {
  const [isEnabled, setIsEnabled] = useState(true);

  const queryFn = async () => {
    const response = await fetch(`${endpoint}/groups/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.json();
  }

  const query = useQuery<Group, Error>({
    queryKey: ["group", id],
    queryFn,
    enabled: !!id && isEnabled,
  });

  return { ...query, setIsEnabled };
}

// Get Groups of User
export function useGetUserGroups(userId: string) {

  const queryFn = async () => {
    const response = await fetch(`${endpoint}/groups?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  return useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn,
    enabled: !!userId,
  });
}

// Create Group
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation<Group, Error, Group>({
    mutationFn: async (payload) => {
      const response = await fetch(`${endpoint}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// Update Group
export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation<Group, Error, { payload: any; id: string }>({
    mutationFn: async ({ payload, id }) => {
      const response = await fetch(`${endpoint}/groups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// Delete Group
export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await fetch(`${endpoint}/groups/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["group", id] });
      queryClient.invalidateQueries({ queryKey: ["groups"], });
    },
  });
}

// Add Member to Group
export function useAddUserToGroup() {
  const queryClient = useQueryClient();
  return useMutation<Group, Error, AddUserPayload>({
    mutationFn: async (payload) => {
      const response = await fetch(`${endpoint}/groups/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// Remove User From Group
export function useRemoveGroupMember() {
  const queryClient = useQueryClient();

  return useMutation<Group, Error, AddUserPayload>({
    mutationFn: async (payload) => {
      const response = await fetch(`${endpoint}/groups/remove-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}