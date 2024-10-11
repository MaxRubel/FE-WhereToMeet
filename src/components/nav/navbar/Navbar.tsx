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
        <button className="nav-link" role="menuitem" onClick={() => { navigate('/') }}>
          MeetUp
        </button>
      </div>
      <div>
        <ul className="nav-list" role="menubar">
          <li className="nav-link" role="menuitem" onClick={() => { navigate('/groups') }} tabIndex={0}>Groups</li>
          <li className="nav-link" role="menuitem" tabIndex={0}>Events</li>
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