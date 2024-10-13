import { Group } from "dataTypes";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

//  Post new group
export function createGroup(payload: Group) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

//  Get Single Group By ID
export function getSingleGroup(id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups/${id}`, {
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

//  Update Group
export function updateGroup(payload: any, id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  })
}

//  Get User Groups
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
      .catch((err) => reject(err))
  });
}

export type AddUserPayload = {
  groupId: string;
  memberId: string
}

//  Add Member to Group
export function addUserToGroup(payload: AddUserPayload) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups/add-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}

//  Remove Member of Group
export function getMembersOfGroup(membersArray: string[]) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups/get-members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(membersArray)
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}

//  Delete a group
export function deleteGroup(id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/groups/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((resp) => resolve(resp))
      .catch((err) => reject(err))
  })
}