const endpoint = import.meta.env.VITE_FIREBASE_ENDPOINT;

export type MessagePayload = {
  eventId: string
  message: string
  userId: string
}

function updateMessage(updates: any) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/messages/${updates.id}.json`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(updates)
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

export function SendMessage(payload: MessagePayload) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/messages.json`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => updateMessage({ id: data.name }))
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}