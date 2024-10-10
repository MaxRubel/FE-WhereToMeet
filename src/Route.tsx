import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import NavBar from "./components/nav/navbar/Navbar";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <div className="main-content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-profile" element={<ProfilePage />} />
            <Route path="/groups" element={<h1>Groups Pages</h1>} />
            <Route path="/events" element={<h1>Events page</h1>} />
          </Routes>
        </div>
      </BrowserRouter>

    </>
  )
}