import { EditIcon, PersonRound } from "@/components/graphics/Graphics1";
import "./ProfilePage.css";
import EditProfileForm from "@/components/pages/ProfilePage/EditProfileForm/EditProfileForm";
import { useState } from "react";
import ChooseAvatarForm from "@/components/pages/ProfilePage/EditProfileForm/ChooseAvatarForm";

export default function ProfilePage() {
  const [isViewing, setIsViewing] = useState("EditProfileForm");

  return (
    <div className="profile-page-layout">
      <div className="profile-side-bar">
        <ul className="profile-list">
          <button
            className="clear-button profile-list-item"
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

          <button
            className="profile-list-item"
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
        </ul>
      </div>
      <div className="profile-main-form">
        {isViewing == "EditProfileForm" && <EditProfileForm />}
        {isViewing == "ChooseAvatarForm" && <ChooseAvatarForm />}
      </div>
    </div>
  );
}
