import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import NavBar from "./components/nav/navbar/Navbar";

export default function Router() {
  return (
    <>
      <NavBar />
      <div className="main-content-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}