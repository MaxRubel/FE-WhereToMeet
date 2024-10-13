import { deleteGroup, getMembersOfGroup, getSingleGroup, updateGroup } from "@/api/groups"
import { EditIcon } from "@/components/graphics/Graphics1"
import { Group, UserDB } from "dataTypes"
import { useState } from "react"
import { formatDate } from "../../../../../utils/formatDate"
import styles from "./ViewSingleGroup.module.css"
import GroupMemberAvatar from "../Components/GroupMemberAvatar"
import AddMember from "../Components/AddMember"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery, useQueryClient } from "react-query"
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
  const [members, setMembers] = useState<UserDB[]>([])
  const [isEditting, setIsEditting] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  const queryClient = useQueryClient();

  const updateGroupMutation = useMutation(
    ({ payload, id }: { payload: any; id: string }) => updateGroup(payload, id),
    {
      onSuccess: () => {
        //@ts-expect-error will not be null
        queryClient.invalidateQueries(['group', thisGroup._id]);
      },
    }
  );

  const deleteGroupMutation = useMutation(
    (id: string) => deleteGroup(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['group', groupId]);
        queryClient.invalidateQueries(['groups', user._id]);
        navigate('/groups');
        setIsViewing("ViewGroups")
      },
      onError: (error) => {
        console.error('Failed to delete group:', error);
        // You might want to show an error message to the user here
      }
    }
  );

  const { data: thisGroup, isLoading: isGroupLoading } = useQuery<Group>(
    ['group', groupId],
    //@ts-ignore
    () => getSingleGroup(groupId),
    {
      onSuccess: (data) => {
        const typedata = data as Group
        setInputVal(typedata?.name)

        //fetch all the group members
        const memberIds: string[] = []

        typedata?.members.forEach((member: any) => {
          memberIds.push(member._id)
        })

        getMembersOfGroup(memberIds).then((data) => {
          const typedData = data as UserDB[]
          setMembers(typedData)
        })
      }
    }
  );

  const updateGroupName = async (e: React.FormEvent) => {
    e.preventDefault()
    //@ts-expect-error this will not be null
    if (thisGroup?._id) {

      updateGroupMutation.mutate({
        payload: { name: inputVal },
        //@ts-expect-error this will not be null
        id: thisGroup._id
      },
        {
          onSuccess: () => {
            setIsEditting(false)
            queryClient.invalidateQueries(['groups', user._id])
          }
        }
      );
    }
  }

  const handleDeleteGroup = () => {
    //@ts-ignore will not be null
    if (thisGroup?._id) {
      //@ts-ignore will not be null
      deleteGroupMutation.mutate(thisGroup._id);
    }
  };

  if (!thisGroup || isGroupLoading) {
    return <GridLoader />
  }

  return (
    <div>
      <div id="header-fields" className="text-left">
        {isEditting ? (
          <form className={styles.newNameForm} onSubmit={updateGroupName}>
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
          //@ts-ignore
          user._id === thisGroup?.ownerId
            ? (
              // THIS IS YOUR GROUP:
              <Button
                onClick={() => setIsEditting(true)}
                className="empty-button"
              >
                {/* @ts-ignore */}
                {thisGroup?.name}
                {/* @ts-ignore */}
                <EditIcon size={20} />
              </Button>
            )
            : (
              //THIS IS NOT YOUR GROUP:
              <h2 className="text-left">
                {/* @ts-ignore */}
                {thisGroup?.name}
              </h2>
            )
        )}


        {/* @ts-ignore */}
        {thisGroup?.dateCreated && (
          <div className="text-left light-font">
            {/* @ts-ignore */}
            created on: {formatDate(thisGroup.dateCreated)}
          </div>
        )}
      </div>

      {/* ----MEMBERS CONTAINER---- */}
      <div className={styles.membersSection}>
        <h3 className="">Members</h3>
        <div className={`light-font ${styles.membersContainer}`}>
          {members.length ? (
            members.map((member) => (
              <GroupMemberAvatar
                key={member._id}
                member={member}
                //@ts-ignore
                group={thisGroup}

              />
            ))
          ) :
            "No members have been added yet..."
          }
        </div>


        {/* ----ADD MEMBER BUTTON---- */}
        <div className={styles.buttonRow}>
          {/* @ts-ignore "groupId is null checked" */}
          <AddMember groupId={thisGroup._id} />
        </div>

        {/* onClick={handleDeleteGroup} */}
        {/* ----DELETE BUTTON---- */}
        <Dialog>
          <DialogTrigger style={{ marginTop: "6em" }} asChild>
            <Button className="deleteButton">
              Delete This Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
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