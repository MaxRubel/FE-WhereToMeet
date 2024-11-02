import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import styles from "./GroupStyles.module.css"
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { findUser } from '@/api/users';
import { Group, UserDB } from 'dataTypes';
import SingleUserSmall from './SingleUserSmall';
import { useAuth } from '@/context/auth/auth';

type props = {
  group: Group
}
export default function AddMember({ group }: props) {
  const [searchValue, setSearchValue] = useState("")
  const [userResults, setUserResults] = useState<UserDB[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    if (searchValue.length > 2) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        findUser(searchValue).then((data) => {
          const typedData = data as UserDB[]

          // don't display people who are already in the group:
          const memberIds = new Set(group.members.map(member => member._id));

          const filteredUsers = typedData.filter(candidate =>
            candidate._id !== user._id && !memberIds.has(candidate._id)
          );
          setUserResults(filteredUsers)
        })
      }, 500);
    } else {
      setUserResults([])
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue]);

  const resetForm = () => {
    setUserResults([])
    setSearchValue("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='secondary-button'>
          Add a Member
        </Button>
      </DialogTrigger>
      <DialogContent style={{ minHeight: "250px" }}>
        <DialogHeader>
          <DialogTitle style={{ marginTop: "1em" }}>
            Add a Member
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className={styles.spacedRow} style={{ marginBottom: "1em" }}>
                <Input
                  placeholder='Search Users'
                  onChange={handleChange}
                  value={searchValue}
                  style={{ color: 'black' }}
                />
              </div>
              <div id="users-container" className={styles.usersContainer}>
                {userResults.map((user) => (
                  <SingleUserSmall
                    key={user._id}
                    user={user}
                    //@ts-ignore
                    groupId={group._id}
                    resetForm={resetForm} />
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}