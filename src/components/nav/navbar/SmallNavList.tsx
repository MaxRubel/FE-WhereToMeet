import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

type props = {
  open: boolean;
};

export default function SmallNavList({ open }: props) {
  return (
    <div
      className="box-shadow"
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        height: "47.4vh",
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
        borderBottomRightRadius: "8%",
        borderBottomLeftRadius: "8%",
      }}
    >
      <div className={styles.smallNavList}>
        <Link to={"/events?creating=true"}>Create New Event</Link>
        <Link to={"/groups"}>View Groups</Link>
        <Link to={"edit-profile"}>Edit Profile</Link>
        <Link style={{ marginTop: ".5em" }} to={""}>
          Sign Out
        </Link>
      </div>
    </div>
  );
}
