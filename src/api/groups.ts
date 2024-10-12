import { Group } from "dataTypes";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

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