import { getMembersOfGroup, getSingleGroup, updateGroup } from "@/api/groups"
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

type props = {
  groupId: string
}

export default function ViewSingleGroup({ groupId }: props) {
  const [members, setMembers] = useState<UserDB[]>([])
  const [isEditting, setIsEditting] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const { user } = useAuth()

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

  const { data: thisGroup, isLoading: isGroupLoading } = useQuery<Group>(
    ['group', groupId],
    //@ts-ignore
    () => getSingleGroup(groupId),
    {
      enabled: !!groupId,
      onSuccess: (data) => {
        const typedata = data as Group
        setInputVal(typedata.name)

        //fetch all the group members
        const memberIds: string[] = []

        typedata.members.forEach((member: any) => {
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


        {/* ----DELETE BUTTON---- */}
        <div style={{ marginTop: "6em" }}>
          <Button className="deleteButton">
            Delete This Group
          </Button>
        </div>

      </div>
    </div >
  )
}