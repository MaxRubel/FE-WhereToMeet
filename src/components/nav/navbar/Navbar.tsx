import { useEffect, useState } from "react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../../context/auth/firebase";
import { useAuth } from "../../../context/auth/auth";
import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";
import { HamburgerIcon } from "@/components/graphics/Graphics1";
import SmallNavList from "./SmallNavList";

export default function NavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [smallNavOpen, setSmallNavOpen] = useState(true);

  const handleClickOut = (e: MouseEvent): void => {
    if (!(e.target instanceof Element)) return;

    if (e.target.id !== "nav-button") {
      setSettingsOpen(false);
    }
  };

  const handleResize = () => {
    const val = window.innerWidth;
    setScreenWidth(val);
    if (val >= 700 && smallNavOpen) {
      setSmallNavOpen(false);
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
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleClickOut);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (screenWidth >= 700) {
    return (
      <nav
        className={styles.navBarContainer}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div role="banner" className={styles.logoDiv}>
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
  } else {
    // SCREEN IS SMALLER THAN 700px
    return (
      <>
        <SmallNavList open={smallNavOpen} />
        <nav
          className={styles.navBarContainer}
          role="navigation"
          aria-label="Main Navigation"
        >
          <div role="banner" className={styles.logoDivSmall}>
            <Link to="/" className={styles.logoHover}>
              Where To Meet
            </Link>
          </div>

          {user && user._id && user._id !== "guest" ? (
            <div className={styles.navbarRightSmall}>
              <button
                id="nav-button"
                className={`clear-button ${styles.greyHoverSmall}`}
                aria-haspopup="true"
                aria-expanded={settingsOpen}
                aria-controls="settings-menu"
                onClick={() => setSmallNavOpen((prevVal) => !prevVal)}
              >
                <img
                  className={styles.avatarPhoto}
                  style={{ pointerEvents: "none" }}
                  src={user.avatarUrl ? user.avatarUrl : user.photoURL}
                  alt="avatar photo"
                />

                <span className="visually-hidden">User Settings</span>
                <HamburgerIcon size={"34"} />
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
          ) : (
            <div>
              <Link to="/sign-in" className={styles.navLink}>
                Please Sign In
              </Link>
            </div>
          )}
        </nav>
      </>
    );
  }
}
