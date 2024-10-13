import { useEffect, useState } from 'react';
import { Group, UserDB } from "dataTypes";
import styles from "./GroupStyles.module.css";
import AddMember from './AddMember';
import { getMembersOfGroup } from '@/api/groups';
import { useAuth } from '@/context/auth/auth';
import { CheckIcon } from '@/components/graphics/Graphics1';
import GroupMemberAvatar from './GroupMemberAvatar';
import { Skeleton } from "@/components/ui/skeleton"

export interface GroupMemberSmall {
  _id: string;
  name: string;
  url: string;
  email: string;
}

interface SingleGroupProps {
  group: Group;
}

export default function SmallGroupCard({ group }: SingleGroupProps) {
  const [members, setMembers] = useState<UserDB[]>([])
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const memberIds: string[] = []
    group.members.forEach((member: any) => {
      memberIds.push(member._id)
    })
    getMembersOfGroup(memberIds).then((data) => {
      const typedData = data as UserDB[]
      setMembers(typedData)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div style={{
        padding: "1em",
        marginBottom: "2em",
        border: "1px solid rgb(240, 240, 240)",
        borderRadius: "10px"
      }}>
        <div style={{ marginBottom: "1em" }}>
          <Skeleton className="w-[200px] h-[30px] " />
        </div>
        <div className={styles.skeleMembers}>
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
          <Skeleton className="w-[40px] h-[40px] rounded-full" />
        </div>
        <div style={{ marginTop: "1em" }}>
          <Skeleton className="w-[100px] h-[45px] " />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.smallGroupContainer}>

        <h2 className='group-title-row'>
          <a href={`/groups/${group._id}`}>
            {group.name}
          </a>
          {group.ownerId === user._id && <CheckIcon size='20' />}
        </h2>

        <div className={styles.membersFlex}>
          {members.length ?
            members.map((member) => (
              <GroupMemberAvatar
                key={member._id}
                member={member}
                group={group}
              />
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