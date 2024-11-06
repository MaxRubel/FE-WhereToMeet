import { UserDB } from "dataTypes"
import styles from "./GroupStyles.module.css"
import { AddUserPayload, useAddUserToGroup } from "@/api/groups"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

type props = {
  user: UserDB
  groupId: string
  resetForm: () => void
}

export default function SingleUserSmall({ user, groupId, resetForm }: props) {
  const addUserToGroup = useAddUserToGroup();
  const [error, setError] = useState(false)

  const handleAddUser = async () => {
    const payload: AddUserPayload = {
      groupId: groupId,
      memberId: user._id
    }

    addUserToGroup.mutate(payload, {
      onSuccess: () => {
        resetForm();
        toast({
          title: "Success!",
          description: `${user.name} has been added to your group.`,
          className: "toastty"
        })
      }
    })
  }

  return (
    <div className={styles.singleUserContainer} onClick={handleAddUser}>
      <div className={styles.nameContainer}>
        <div className={styles.userName}>{user.name}</div>
        <div>+ Invite Person</div>
      </div>
      <div>
        <img
          src={error
            ? "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
            : user.avatarUrl}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    </div>
  )
}