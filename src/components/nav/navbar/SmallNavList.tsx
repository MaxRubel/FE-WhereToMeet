import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

type props = {
  open: boolean;
  signOut: () => void;
  closeNavList: () => void;
};

export default function SmallNavList({ open, signOut, closeNavList }: props) {
  return (
    <div
      className={`${styles.smallContainer} box-shadow`}
      style={{ top: open ? "60px" : "-50vh" }}
    >
      <div className={styles.smallNavList}>
        <Link to={"/events?creating=true"} onClick={closeNavList}>
          Create New Event
        </Link>
        <Link to={"/events"} onClick={closeNavList}>
          Events
        </Link>
        <Link to={"/groups"} onClick={closeNavList}>
          Groups
        </Link>
        <Link to={"edit-profile"} onClick={closeNavList}>
          Edit Profile
        </Link>
        <Link
          style={{ marginTop: ".5em" }}
          to={"/"}
          onClick={() => {
            closeNavList();
            signOut();
          }}
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}
