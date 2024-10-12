import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home/Home";
import NavBar from "./components/nav/navbar/Navbar";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import EventPage from "./components/pages/ProfilePage/EventsPage";
import GroupsPage from "./components/pages/GroupsPage/GroupsPage";
import { createContext, ReactNode, useContext } from "react";
import { useToast } from "./hooks/use-toast";
import ViewSingleGroup from "./components/pages/GroupsPage/ViewSingleGroup/ViewSingleGroup";

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

export default function Router() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <NavBar />
        <div className="main-content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-profile" element={<ProfilePage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupsPage/>} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </ToastProvider>
  );
}
