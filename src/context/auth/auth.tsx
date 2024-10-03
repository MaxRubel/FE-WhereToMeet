import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { UserCredential as FirebaseUser } from 'firebase/auth';

type CustomUser = null | "unregistered" | FirebaseUser;

interface AuthContextType {
  user: CustomUser;
  setUser: Dispatch<SetStateAction<CustomUser>>;
}

const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { }
});

//@ts-expect-error no need to check children
export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState<CustomUser>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) { setUser(JSON.parse(user)) }
  }, [])

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(authContext)
}