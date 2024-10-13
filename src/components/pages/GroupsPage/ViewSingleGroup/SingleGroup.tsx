import { useEffect, useState } from 'react';
import { Group, UserDB } from "dataTypes";
import { formatDate } from "../../../../../utils/formatDate";
import styles from "./GroupStyles.module.css";
import AddMember from './AddMember';
import { getMembersOfGroup } from '@/api/groups';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  const [members, setMembers] = useState<UserDB[]>([])

  useEffect(() => {
    const memberIds: string[] = []
    group.members.forEach((member: any) => {
      memberIds.push(member._id)
    })
    getMembersOfGroup(memberIds).then((data) => {
      const typedData = data as UserDB[]
      setMembers(typedData)
    })

  }, [])

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
              <TooltipProvider key={member._id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <img
                        src={member.avatarUrl}
                        alt="Avatar"
                        className="h-12 w-12 rounded-full object-cover cursor-pointer bg-background"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    className='bg-white text-black shadow-md rounded-md p-2'>
                    <p style={{ fontWeight: "600" }}>{member.name}</p>
                    <p>{member.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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