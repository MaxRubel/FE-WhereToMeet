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
      className="box-shadow"
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        height: "46vh",
        width: "93%",
        margin: "auto",
        position: "fixed",
        top: open ? "60px" : "-50vh",
        left: "0",
        right: "0",
        zIndex: 9,
        padding: "1.5em 3em",
        fontSize: "1.5em",
        transition: ".5s all ease",
        border: "none",
        borderBottomRightRadius: "5%",
        borderBottomLeftRadius: "5%",
      }}
    >
      <div className={styles.smallNavList}>
        <Link to={"/events?creating=true"} onClick={closeNavList}>
          Create New Event
        </Link>
        <Link to={"/groups"} onClick={closeNavList}>
          View Groups
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
