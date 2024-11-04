import {
  EditIcon,
  ModeratorIcon,
  PersonRound,
} from "@/components/graphics/Graphics1";
import "./ProfilePage.css";
import EditProfileForm from "@/components/pages/ProfilePage/EditProfileForm/EditProfileForm";
import { useState } from "react";
import ChooseAvatarForm from "@/components/pages/ProfilePage/EditProfileForm/ChooseAvatarForm";
import EditPrivacyForm from "./PrivacySection/EditPrivacyForm";

export default function ProfilePage() {
  const [isViewing, setIsViewing] = useState("EditProfileForm");

  return (
    <div className="profile-page-layout">
      <div className="profile-side-bar">
        <ul className="profile-list">
          {/* ----Edit Privacy---- */}
          <button
            className="clear-button side-list-item"
            style={{
              fontWeight: isViewing == "EditProfileForm" ? "900" : "",
              backgroundColor:
                isViewing == "EditProfileForm"
                  ? "rgb(245,245,245)"
                  : "transparent",
            }}
            onClick={() => {
              setIsViewing("EditProfileForm");
            }}
          >
            <EditIcon size="18" />
            Edit Profile
          </button>

          {/* ----Choose Avatar---- */}
          <button
            className="side-list-item"
            style={{
              fontWeight: isViewing == "ChooseAvatarForm" ? "900" : "",
              backgroundColor:
                isViewing == "ChooseAvatarForm"
                  ? "rgb(245,245,245)"
                  : "transparent",
            }}
            onClick={() => {
              setIsViewing("ChooseAvatarForm");
            }}
          >
            <PersonRound size="18" />
            Choose Avatar
          </button>

          {/* ----Edit Privacy---- */}
          <button
            className="clear-button side-list-item"
            style={{
              fontWeight: isViewing == "EditPrivacy" ? "900" : "",
              backgroundColor:
                isViewing == "EditPrivacy" ? "rgb(245,245,245)" : "transparent",
            }}
            onClick={() => {
              setIsViewing("EditPrivacy");
            }}
          >
            <ModeratorIcon size="18" />
            Privacy Settings
          </button>
        </ul>
      </div>
      <div className="profile-main-form">
        {isViewing === "EditProfileForm" && <EditProfileForm />}
        {isViewing === "ChooseAvatarForm" && <ChooseAvatarForm />}
        {isViewing === "EditPrivacy" && <EditPrivacyForm />}
      </div>
    </div>
  );
}
