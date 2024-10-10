import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

import { checkUser } from "../../api/users";
import type { UserType } from "../../../dataTypes"

type AuthContextType = {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  checkUserFunc: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  checkUserFunc: () => { },
});

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserType>(null);
  const [checkUserCount, setCheckUserCount] = useState(0)

  const checkUserFunc = () => {
    setCheckUserCount((preVal) => preVal + 1)
  }

  useEffect(() => {
    const user = localStorage.getItem("user");

    // local storage item found:
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);

      checkUser({ uid: parsedUser.uid })
        .then((resp: any) => {
          if (resp.userExists) {
            const storeUser = { ...parsedUser, ...resp.user, };
            setUser(storeUser);
            localStorage.setItem("user", JSON.stringify(storeUser));
          }
        })
        .catch((err: any) => {
          console.error(
            "NOT CONNECTING TO DB... MAKE SURE ENV IS SET AND SERVER RUNNING",
            err
          );
        });

      // no local storage item found:
    } else {
      setUser("notLoggedIn");
    }
  }, [checkUserCount]);

  return (
    <authContext.Provider value={{ user, setUser, checkUserFunc }}>
      {children}
    </authContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(authContext);
}
