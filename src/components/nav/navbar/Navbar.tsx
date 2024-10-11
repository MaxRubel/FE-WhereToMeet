import { PersonRound } from "@/components/graphics/Graphics1"
import { useEffect, useState } from "react"
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../../context/auth/firebase';
import { useAuth } from '../../../context/auth/auth';
import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css"

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
    <nav className={styles.navBarContainer} role="navigation" aria-label="Main Navigation">
      <div className="logo" role="banner">
        <button className="nav-link" role="menuitem" onClick={() => { navigate('/') }}>
          MeetUp
        </button>
      </div>
<<<<<<< HEAD
      <div>
        <ul className="nav-list" role="menubar">
          <li className="nav-link" role="menuitem" onClick={() => { navigate('/groups') }} tabIndex={0}>Groups</li>
          <li className="nav-link" role="menuitem" tabIndex={0}>Events</li>
        </ul>
      </div>
      <div className="navbar-right">
=======

      <ul className={styles.navList}>
        <li>
          <a href="/groups" className="nav-link">Groups</a>
        </li>
        <li>
          <a href="/events" className="nav-link">Events</a>
        </li>
      </ul>

      <div className={styles.navbarRight}>
>>>>>>> main
        <button
          id="nav-button"
          className={`clear-button ${styles.greyHover}`}
          aria-haspopup="true"
          aria-expanded={settingsOpen}
          aria-controls="settings-menu"
          onClick={() => setSettingsOpen((prevVal) => !prevVal)}
        >
          <PersonRound size={"22"} aria-hidden="true" />
          <span className="visually-hidden">User Settings</span>
        </button>
        {settingsOpen && (
          <div
            id="settings-menu"
            className={styles.settingsMenuNav}
            role="menu"
            aria-labelledby="nav-button"
          >
            <button
              id="edit-profile-button"
              className={styles.navButton}
              role="menuitem"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>
            <button
              id="sign-out-button"
              className={styles.navButton}
              onClick={signOut}
              role="menuitem"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}