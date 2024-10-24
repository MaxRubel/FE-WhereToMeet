import { RefObject, useRef } from "react";
import { useAuth } from "@/context/auth/auth";
import { deleteUser } from "@/api/users";
import style from "./home.module.css";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

export default function Home() {
  const buttonRef: RefObject<HTMLButtonElement> = useRef(null);
  const { user, setUser } = useAuth();

  const handleTestEndpoint = async () => {
    try {
      const resp = await fetch(endpoint);
      console.warn(resp);
      if (buttonRef.current) {
        buttonRef.current.style.backgroundColor = "Green";
        buttonRef.current.style.color = "white";
      }
    } catch (err) {
      console.error("Not connecting to endpoint: ", err);
      if (buttonRef.current) {
        buttonRef.current.style.backgroundColor = "red";
        buttonRef.current.style.color = "white";
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user._id);
      setUser("notLoggedIn");
      localStorage.setItem("user", "");
    } catch (err) {
      console.error("unable to delete user: ", err);
    }
  };

  return (
    <div id="home-page-container" className={style.homePageContainer}>
      <div className={style.content}>
        {/* fixed section */}
        <div className={`${style.announcementsContainer} centered`}>
          Announcments
          {/* <img src="elvesChatting.jpeg" alt="" style={{ objectFit: "fill", width: "100%" }} /> */}
        </div>

        {/* 2nd Section */}
        <div className={style.lowerSection}>
          <h1>Welcome!</h1>
          <button onClick={handleTestEndpoint} ref={buttonRef}>
            Test Server Endpoint
          </button>
          <button onClick={handleDeleteUser}>Delete Your User</button>
        </div>
      </div>
    </div>
  );
}
