import { useEffect, useState } from 'react';
import { Group } from "dataTypes";
import { formatDate } from "../../../../../utils/formatDate";
import styles from "./GroupStyles.module.css"; import Avatar from '../Avatar';
import AddMember from './AddMember';



export interface GroupMemberSmall {
  _id: string;
  name: string;
  url: string;
  email: string;
}

interface SingleGroupProps {
  group: Group;
}

export default function SingleGroup({ group }: SingleGroupProps) {
  const [members, setMembers] = useState<GroupMemberSmall[]>([])

  // useEffect(() => {
  //   console.log("fetching members")
  // }, [])

  return (
    <>
      <div className={styles.smallGroupContainer}>
        <h2><a href={`/groups/${group._id}`}>{group.name}</a></h2>
        <p className={styles.createdOn}>
          Created on: {group.dateCreated && formatDate(group.dateCreated)}
        </p>
        <div className={styles.membersFlex}>
          {members.length ?
            members.map((member) => (
              <Avatar key={member.email} member={member} />
            ))
            :
            "No one has been added to this group yet..."
          }
        </div>
        {/* @ts-expect-error (groupId is not null) */}
        <AddMember groupId={group._id} />
      </div>
    </>
  );
}