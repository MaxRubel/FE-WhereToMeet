import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home/Home";
import NavBar from "./components/nav/navbar/Navbar";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import EventPage from "./components/pages/EventsPage/EventPage";
import GroupsPage from "./components/pages/GroupsPage/GroupsPage";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useToast } from "./hooks/use-toast";
import ViewSingleEvent from "./components/pages/EventsPage/ViewEvents/SingleEvent/ViewSingleEvent";
import { useAuth } from "./context/auth/auth";
import ViewSingleGroup from "./components/pages/GroupsPage/ViewSingleGroup/ViewSingleGroup";
// import ViewSingleGroup from "./components/pages/GroupsPage/ViewSingleGroup/ViewSingleGroup";

// Create the context
const ToastContext = createContext<((props: any) => void) | undefined>(
  undefined
);

// Custom hook to use the toast context
export const useToastContext = (): ((props: any) => void) => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

// Props type for ToastProvider
interface ToastProviderProps {
  children: ReactNode;
}

// ToastProvider component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toast } = useToast();

  return (
    <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
  );
};

type ChildrenProp = { children: ReactNode };

// confirms routes are public by checking the against URL
// another check is performed inside the component as well
const PublicRouteChecker = ({ children }: ChildrenProp) => {
  const { setIsPublicRoute } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isPublic = searchParams.get("public") === "true";

    if (location.pathname.includes("/events") && isPublic) {
      setIsPublicRoute(true);
    }
  }, [location, setIsPublicRoute]);

  return children;
};

export default function Router() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <PublicRouteChecker>
          <NavBar />
          <div className="main-content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit-profile" element={<ProfilePage />} />
              <Route path="/events" element={<EventPage />} />
              <Route path="/events/:eventId" element={<ViewSingleEvent />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/:groupId" element={<ViewSingleGroup />} />
            </Routes>
          </div>
          <Toaster />
        </PublicRouteChecker>
      </BrowserRouter>
    </ToastProvider>
  );
}
