import { PersonRound } from "@/components/graphics/Graphics1"
import "./navbar.css"
import { useEffect, useState } from "react"
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../../context/auth/firebase';
import { useAuth } from '../../../context/auth/auth';
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setUser } = useAuth()
  const navigate = useNavigate()

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
    <nav className="nav-bar-container" role="navigation" aria-label="Main Navigation">
      <div className="logo" role="banner">
        MeetUp
      </div>
      <div>
        <ul className="nav-list" role="menubar">
        <button id="groups-button" className="nav-button-inside-nav" role="menuitem" onClick={() => { navigate('/groups') }}>
          Groups
        </button>
        <button id="events-button" className="nav-button-inside-nav" role="menubar" onClick={()=> {navigate('/events')}} >
          Events
        </button>
        </ul>
      </div>
      <div className="navbar-right">
        <button
          id="nav-button"
          className="clear-button grey-hover"
          aria-haspopup="true"
          aria-expanded={settingsOpen}
          aria-controls="settings-menu"
          onClick={() => {
            setSettingsOpen((prevVal) => !prevVal)
          }}
        >
          <PersonRound size={"22"} aria-hidden="true" />
          <span className="visually-hidden">User Settings</span>
        </button>
        <div
          id="settings-menu"
          className="settings-menu-nav"
          role="menu"
          aria-labelledby="nav-button"
          style={{ display: settingsOpen ? "block" : "none" }}
        >
          <button id="edit-profile-button" className="nav-button" role="menuitem" onClick={() => { navigate('/edit-profile') }}>
            Edit Profile
          </button>
          <button
            id="sign-out-button"
            className="nav-button"
            onClick={signOut}
            role="menuitem"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>

  )
}