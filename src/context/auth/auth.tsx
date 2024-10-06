import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
// import { UserCredential as FirebaseUser } from "firebase/auth";
import { checkUser } from "../../api/users";

// type CustomUser = null | "notLoggedIn" | "unregistered" | FirebaseUser;

type AuthContextType = {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
});

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    // local storage item found:
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);

      checkUser({ uid: parsedUser.uid })
        .then((resp: any) => {
          if (resp.userExists) {
            const storeUser = { ...resp.user, ...parsedUser };
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
  }, []);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(authContext);
}
