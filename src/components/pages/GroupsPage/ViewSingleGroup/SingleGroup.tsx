import { useEffect, useState } from 'react';
import { Group } from "dataTypes";
import { formatDate } from "../../../../../utils/formatDate";
import styles from "./GroupStyles.module.css"; import Avatar from '../Avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ComboboxDemo } from '@/components/ui/ComboBoxDemo';


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

  useEffect(() => {
    console.log("fetching members")
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
              <Avatar key={member.email} member={member} />
            ))
            :
            "No one has been added to this group yet..."
          }
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='secondary-button'>
              Add Someone
            </Button>
          </DialogTrigger>
          <DialogContent style={{ minHeight: "250px" }}>
            <DialogHeader>
              <DialogTitle>Add Someone</DialogTitle>
              <DialogDescription className={styles.spacedRow}>
                <ComboboxDemo />
                <Button>Add</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}