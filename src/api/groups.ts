import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

//  Get Single Group By ID
export function useGetSingleGroup(id: string) {
  const [isEnabled, setIsEnabled] = useState(true);

  const query = useQuery({
    enabled: !!id && isEnabled,
    queryKey: ["groups", id],
    queryFn: async () => {
      const response = await fetch(`${endpoint}/groups/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    },
  });
  return { ...query, setIsEnabled };
}

//  Get Groups of User
export function useGetUserGroups(userId: string) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["groups"],
    queryFn: () =>
      fetch(`${endpoint}/groups?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((resp) => resp.json()),
  });
}

//  Create Group
export function useCreateGroup() {
  const queryClient = useQueryClient();

  function createGroup(payload: any) {
    return fetch(`${endpoint}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((resp) => resp.json());
  }

  return useMutation(createGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
    },
  });
}

//  Update Group
export function useUpdateGroup() {
  const queryClient = useQueryClient();

  function updateGroup({ payload, id }: { payload: any; id: string }) {
    return fetch(`${endpoint}/groups/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((resp) => resp.json());
  }

  return useMutation(updateGroup, {
    onSuccess: (_, variables) => {
      console.log("updated group ", variables.id);
      queryClient.invalidateQueries(["groups", variables.id]);
      queryClient.invalidateQueries(["groups"]);
    },
  });
}

//  Delete Group
export function useDeleteGroup(id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      fetch(`${endpoint}/groups/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["groups", id]);
      },
    }
  );
}

export function getUserGroups(userId: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups?userId=${userId}`, {
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

export type AddUserPayload = {
  groupId: string;
  memberId: string;
};

//  Add Member to Group
export function useAddUserToGroup() {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AddUserPayload) =>
      fetch(`${endpoint}/groups/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((resp) => resp.json()),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["groups", variables.groupId]);
        queryClient.invalidateQueries(["groups"]);
      },
    }
  );
}

//  Remove User From Group
export function useRemoveGroupMember() {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AddUserPayload) =>
      fetch(`${endpoint}/groups/remove-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((resp) => resp.json()),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["groups", variables.groupId]);
        queryClient.invalidateQueries(["groups"]);
      },
    }
  );
}
