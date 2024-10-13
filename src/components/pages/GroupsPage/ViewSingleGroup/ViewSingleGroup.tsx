import { getMembersOfGroup, getSingleGroup } from "@/api/groups"
import { EditIcon } from "@/components/graphics/Graphics1"
import { Group, UserDB } from "dataTypes"
import { useEffect, useState } from "react"
import { formatDate } from "../../../../../utils/formatDate"
import styles from "./ViewSingleGroup.module.css"
import GroupMemberAvatar from "../Components/GroupMemberAvatar"
import AddMember from "../Components/AddMember"
import { Button } from "@/components/ui/button"

type props = {
  groupId: string
}

export default function ViewSingleGroup({ groupId }: props) {
  const [thisGroup, setThisGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<UserDB[]>([])

  useEffect(() => {
    if (!groupId) {
      console.error("No group ID supplied in URL Param")
      return
    }

    try {
      getSingleGroup(groupId).then((resp) => {
        const typedResp = resp as Group
        setThisGroup(typedResp)


        //  Fetch the group members
        const memberIds: string[] = []
        typedResp.members.forEach((member: any) => {
          memberIds.push(member._id)
        })
        getMembersOfGroup(memberIds).then((data) => {
          const typedData = data as UserDB[]
          setMembers(typedData)
        })
      })
    } catch (err) {
      console.error("error fetching single group", err)
    }
  }, [])

  if (!thisGroup) {
    return "Loading"
  }

  return (
    <div>
      <div id="header-fields" className="text-left">
        <Button
          variant="outline"
          className={styles.deleteButton}
          style={{
            paddingLeft: "0px",
            backgroundColor: "transparent",
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "black",
            display: "flex",
            gap: ".6em",
            boxShadow: "none",
            border: "none",
            outline: "none"
          }}
        >
          {thisGroup?.name}
          <EditIcon size="20" />
        </Button>
        {thisGroup.dateCreated && (
          <div className="text-left">
            Created on: {formatDate(thisGroup.dateCreated)}
          </div>
        )}
      </div>
      <div className={styles.membersSection}>
        <h3 className="">Members</h3>
        <div className={styles.membersContainer}>
          {members.length ? (
            members.map((member) => (
              <GroupMemberAvatar
                key={member._id}
                member={member}
                group={thisGroup}
              />
            ))
          ) :
            "No members have been added yet..."
          }
        </div>
        {thisGroup &&
          <>
            <div className={styles.buttonRow}>
              {/* @ts-ignore "groupId is null checked" */}
              <AddMember groupId={thisGroup._id} />
            </div>
            <div style={{ marginTop: "6em" }}>
              <Button
                style={{
                  color: "red",
                  backgroundColor: "white",
                  border: "1px solid lightgrey"
                }}
                className={styles.deleteRed}
              >
                Delete This Group
              </Button>
            </div>
          </>
        }
      </div>
    </div >
  )
}