import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";

// Define the context type
type NavContextType = {
  comingFrom: string | null;
  setComingFrom: Dispatch<SetStateAction<string | null>>;
};

// Create context with proper type and default value
const NavContext = createContext<NavContextType>({
  comingFrom: null,
  setComingFrom: () => null,
});

export default function NavContextProvider({ children }: { children: React.ReactNode }) {
  const [comingFrom, setComingFrom] = useState<string | null>(null);

  return (
    <NavContext.Provider
      value={{ comingFrom, setComingFrom }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNavContext() {
  return useContext(NavContext)
}