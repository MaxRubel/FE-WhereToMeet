import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home/Home";
import NavBar from "./components/nav/navbar/Navbar";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import GroupsPage from "./components/pages/GroupsPage/GroupsPage";
import { createContext, useContext } from "react";
import { useToast } from "./hooks/use-toast";

// Create a context for the toast function
const ToastContext = createContext(null);

// Custom hook to use toast
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

export default function Router() {
  const { toast } = useToast();
  return (
    <ToastContext.Provider value={toast}>
      <BrowserRouter>
        <NavBar />
        <div className="main-content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-profile" element={<ProfilePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/events" element={<h1>Events page</h1>} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </ToastContext.Provider>
  );
}
