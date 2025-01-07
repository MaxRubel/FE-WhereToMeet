import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { GridLoader } from "react-spinners";
import { checkUser } from "../../api/users";
import { UserType } from "dataTypes";

type AuthContextType = {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  checkUserFunc: () => void;
  isPublicRoute: boolean;
  setIsPublicRoute: Dispatch<SetStateAction<boolean>>;
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  checkUserFunc: () => { },
  isPublicRoute: false,
  setIsPublicRoute: () => { },
  isGuest: false,
  setIsGuest: () => { },
  isLoading: false,
});


export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserType>(null);
  const [checkUserCount, setCheckUserCount] = useState(0);
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading]=useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = urlParams.get("guest");
    if (params === "true") setIsGuest(true);
  }, []);


  const checkUserFunc = useCallback(() => {
    setCheckUserCount((preVal) => preVal + 1);
  }, [])

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoading(true);
    // local storage item found:
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);

      checkUser({ uid: parsedUser.uid })
        .then((resp: any) => {
          if (resp.userExists) {
            const storeUser = { ...parsedUser, ...resp.user };
            setUser(storeUser);
            localStorage.setItem("user", JSON.stringify(storeUser));
            setIsLoading(false);
            
          }
        })
        .catch((err: any) => {
          console.error(
            "NOT CONNECTING TO DB... MAKE SURE ENV IS SET AND SERVER RUNNING",
            err
          );
        })
        .finally(()=>{
        setIsLoading(false);
    })

      // no local storage item found:
    } else if (!isGuest) {
      setUser("notLoggedIn");
      setIsLoading(false)
    } else if (isGuest) {
      setUser({ _id: "guest" });
      setIsLoading(false)
    }
  }, [checkUserCount, isGuest]);

  const memoizedContextValue = useMemo(() => ({
    user,
    setUser,
    checkUserFunc,
    isPublicRoute,
    setIsPublicRoute,
    isGuest,
    setIsGuest,
    isLoading,
  }), [user, isPublicRoute, isGuest, isLoading]);
  
  if(isLoading){
   return( <GridLoader/>)
  }
  
  return (
    <authContext.Provider
      value={memoizedContextValue}
    >
      {children}
    </authContext.Provider>
  );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(authContext);
}

export function usePublicRoute(privateData: boolean) {
  const { setIsPublicRoute, setIsGuest } = useAuth();

  useEffect(() => {
    if (privateData) {
      setIsPublicRoute(false);
      setIsGuest(false);
    } else {
      setIsPublicRoute(true);
    }
    return () => {
      setIsGuest(false);
      setIsPublicRoute(false);
    };
  }, [privateData]);
}