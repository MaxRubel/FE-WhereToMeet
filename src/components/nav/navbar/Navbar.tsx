import { PersonRound } from "@/components/graphics/Graphics1"
import "./navbar.css"
import { useEffect, useState } from "react"
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../../context/auth/firebase';
import { useAuth } from '../../../context/auth/auth';

export default function NavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setUser } = useAuth()

  const handleClickOut = (e: MouseEvent): void => {
    if (!(e.target instanceof Element)) return;

    if (e.target.id !== "nav-button") {
      setSettingsOpen(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser("notLoggedIn")
      localStorage.setItem("user", "");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };


  useEffect(() => {
    document.addEventListener("click", handleClickOut)

    return () => {
      document.removeEventListener("click", handleClickOut)
    }
  }, [])

  return (
    <div className="nav-bar-container">
      <div className="logo">
        MeetUp
      </div>
      <div>
        <ul className="nav-list">
          <li className="nav-link">Groups</li>
          <li className="nav-link">Events</li>
        </ul>
      </div>
      <div className="navbar-right">
        <button id="nav-button" className="clear-button grey-hover"
          onClick={() => {
            setSettingsOpen((preVal) => !preVal)
          }}>
          <PersonRound size={"22"} />
        </button>
        <div className="settings-menu-nav"
          style={{ display: settingsOpen ? "block" : "none" }}>
          <button id="nav-button" className="nav-button">Edit Profile</button>
          <button id="nav-button" className="nav-button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>

  )
}