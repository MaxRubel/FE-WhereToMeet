import { UserDB } from "dataTypes"
import styles from "./GroupStyles.module.css"
import { AddUserPayload, addUserToGroup } from "@/api/groups"
import { toast } from "@/hooks/use-toast"

type props = {
  user: UserDB
  groupId: string
}

export default function SingleUserSmall({ user, groupId }: props) {

  const handleAddUser = async () => {
    const payload: AddUserPayload = {
      groupId: groupId,
      memberId: user._id
    }

    try {
      await addUserToGroup(payload)
      toast({
        title: "Success!",
        description: `${user.name} has been added to your group.`,
        className: "toastty"
      })
    } catch (err) {
      console.error("error adding user to group: ", err)
    }
  }

  return (
    <div className={styles.singleUserContainer} onClick={handleAddUser}>
      <div className={styles.nameContainer}>
        <div className={styles.userName}>{user.name}</div>
        <div>+ Invite Person</div>
      </div>
      <div>
        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
      </div>
    </div>

    // look in members array of every group for userId?
  )
}