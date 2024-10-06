import { EditIcon } from "@/components/graphics/Graphics1"
import "./ProfilePage.css"
import EditProfileForm from "@/components/forms/EditProfileForm/EditProfileForm"

export default function ProfilePage() {
  return (
    <div className="profile-page-layout">
      <div className="profile-side-bar">
        <ul className="profile-list">
          <li className="profile-list-item">
            <EditIcon size="18" /> Edit Profile
          </li>
        </ul>
      </div>
      <div className="profile-main-form">
        <EditProfileForm />
      </div>
    </div>
  )
}