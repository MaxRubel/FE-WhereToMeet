import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction, ReactNode } from "react";
import { UserCredential as FirebaseUser } from 'firebase/auth';

type CustomUser = null | "unregistered" | FirebaseUser;

type AuthContextType = {
  user: CustomUser;
  setUser: Dispatch<SetStateAction<CustomUser>>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { }
});


export default function AuthContextProvider({ children }: AuthContextProviderProps) {
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