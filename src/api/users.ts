import { RegisterUserForm } from "@/components/forms/RegistrationForm/RegistrationForm";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

type checkUserType = {
  userId: string;
};

export function checkUser(payload: checkUserType) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/exists`, {
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

export function registerUser(payload: RegisterUserForm) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users`, {
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

//  Delete user -- USES THE GOOGLE-AUTH UID
export function deleteUser(id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/${id}`, {
      method: "DELETE",
    })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}
