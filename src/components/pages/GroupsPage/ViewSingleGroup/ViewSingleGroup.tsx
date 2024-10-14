import { useDeleteGroup, useGetSingleGroup, useUpdateGroup } from "@/api/groups"
import { EditIcon } from "@/components/graphics/Graphics1"
import { Group } from "dataTypes"
import { useEffect, useState } from "react"
import { formatDate } from "../../../../../utils/formatDate"
import styles from "./ViewSingleGroup.module.css"
import GroupMemberAvatar from "../Components/GroupMemberAvatar"
import AddMember from "../Components/AddMember"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GridLoader } from "react-spinners"
import { useAuth } from "@/context/auth/auth"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"

type props = {
  groupId: string
  setIsViewing: (view: string) => void;
}

export default function ViewSingleGroup({ groupId, setIsViewing }: props) {
  const [isEditting, setIsEditting] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  const deleteGroupMutation = useDeleteGroup(groupId);
  const updateGroupMutation = useUpdateGroup();
  const { data, isLoading, setIsEnabled } = useGetSingleGroup(groupId);

  const group = data as Group

  useEffect(() => {
    setInputVal(group?.name)
  }, [group])

  const handleDeleteGroup = () => {
    setIsEnabled(false)
    deleteGroupMutation.mutate(groupId, {
      onSuccess: () => {
        navigate('/groups')
        setIsViewing("ViewGroups")
      },
      onError: (error) => {
        console.error("Failed to delete group:", error);
      },
    });
  };

  const handleUpdateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name: inputVal }

    updateGroupMutation.mutate(
      { payload, id: groupId },
      {
        onSuccess: () => {
          setIsEditting(false)
        },
        onError: (error: any) => {
          console.error('Failed to update group:', error);
        }
      }
    );
  }

  if (isLoading) {
    return <GridLoader />
  }

  return (
    <div>
      <div id="header-fields" className="text-left">
        {isEditting ? (
          <form className={styles.newNameForm} onSubmit={handleUpdateGroup}>
            <Input
              value={inputVal}
              className={styles.newInput}
              required
              onChange={(e) => setInputVal(e.target.value)}
            />
            <div className={styles.topButtonRowForm}>
              <Button type="submit">
                Submit
              </Button>
              <Button
                type="button"
                className="secondary-button"
                onClick={() => setIsEditting(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          // NOT EDITTING:
          user._id === group?.ownerId
            ? (
              // THIS IS YOUR GROUP:
              <Button
                onClick={() => setIsEditting(true)}
                className="empty-button"
              >
                {data?.name}
                <EditIcon size={"20"} />
              </Button>
            )
            : (
              //THIS IS NOT YOUR GROUP:
              <h2 className="text-left">
                {data?.name}
              </h2>
            )
        )}

        {group?.dateCreated && (
          <div className="text-left light-font">
            created on: {formatDate(group?.dateCreated)}
          </div>
        )}
      </div>

      {/* ----MEMBERS CONTAINER---- */}
      <div className={styles.membersSection}>
        <h3 className="">Members</h3>
        <div className={`light-font ${styles.membersContainer}`}>
          {group?.members?.length ? (
            group?.members?.map((member) => (
              <GroupMemberAvatar
                key={member._id}
                member={member}
                group={group}
              />
            ))
          ) :
            "No members have been added yet..."
          }
        </div>


        {/* ----ADD MEMBER BUTTON---- */}
        <div className={styles.buttonRow}>
          {/* @ts-ignore "groupId is null checked" */}
          <AddMember groupId={group?._id} />
        </div>

        {/* ----DELETE BUTTON---- */}
        <Dialog>
          <DialogTrigger style={{ marginTop: "6em" }} asChild>
            <Button className="deleteButton">
              Delete This Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="text-left">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your group and remove all of its events from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="text-left flex gap-4">
              <Button style={{ backgroundColor: "red" }}
                onClick={handleDeleteGroup}>Yes, Delete</Button>
              <DialogClose asChild>
                <Button className="secondary-button">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        <div >
        </div>

      </div>
    </div >
  )

}