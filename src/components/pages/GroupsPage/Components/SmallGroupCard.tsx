import { Group } from "dataTypes";
import styles from "./GroupStyles.module.css";
import AddMember from './AddMember';
import { useAuth } from '@/context/auth/auth';
import { CheckIcon } from '@/components/graphics/Graphics1';
import GroupMemberAvatar from './GroupMemberAvatar';
import { Link } from "react-router-dom";

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
  const { user } = useAuth()

  return (
    <>
      <div className={styles.smallGroupContainer}>

        {/* CARD TITLE */}
        <h2 className='group-title-row'>
          <Link to={`/groups/${group._id}`}>
            {group.name}
          </Link>
          {group.ownerId === user._id && <CheckIcon size='20' />}
        </h2>

        {/* MEMBERS CONTAINER */}
        <div className={styles.membersFlex}>
          {group.members?.length ?
            group.members?.map((member) => (
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

        <AddMember group={group} />
      </div>
    </>
  );
}