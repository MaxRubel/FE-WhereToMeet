const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER

type checkUserType = {
  userId: string
}

export async function checkUser(payload: checkUserType) {
  try {
    const resp = await fetch(`${endpoint}/users/exists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const parsed = await resp.json()
    return parsed

  } catch (err: any) {
    throw new Error(err)
  }

}