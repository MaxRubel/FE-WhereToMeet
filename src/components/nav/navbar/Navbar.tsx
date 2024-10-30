import { useEffect, useState } from "react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../../context/auth/firebase";
import { useAuth } from "../../../context/auth/auth";
import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleClickOut = (e: MouseEvent): void => {
    if (!(e.target instanceof Element)) return;

    if (e.target.id !== "nav-button") {
      setSettingsOpen(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser("notLoggedIn");
      localStorage.setItem("user", "");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOut);

    return () => {
      document.removeEventListener("click", handleClickOut);
    };
  }, []);

  return (
    <nav
      className={styles.navBarContainer}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="logo" role="banner">
        <Link to="/" className={styles.logoHover}>
          Where To Meet
        </Link>
      </div>

      {user && user._id && user._id !== "guest" ? (
        <>
          <ul className={styles.navList}>
            <li>
              <Link to="/events" className={styles.navLink}>
                Events
              </Link>
            </li>
            <li>
              <Link to="/groups" className={styles.navLink}>
                Groups
              </Link>
            </li>
          </ul>

          <div className={styles.navbarRight}>
            <button
              id="nav-button"
              className={`clear-button ${styles.greyHover}`}
              aria-haspopup="true"
              aria-expanded={settingsOpen}
              aria-controls="settings-menu"
              onClick={() => setSettingsOpen((prevVal) => !prevVal)}
            >
              <img
                className={styles.avatarPhoto}
                style={{ pointerEvents: "none" }}
                src={user.avatarUrl ? user.avatarUrl : user.photoURL}
                alt="avatar photo"
              />

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
                  onClick={() => navigate("/edit-profile")}
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
        </>
      ) : (
        <div>
          <Link to="/sign-in" className={styles.navLink}>
            Please Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}