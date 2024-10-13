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
import { UserDB } from 'dataTypes';
import SingleUserSmall from './InviteUserCard';

type props = {
  groupId: string
}
export default function AddMember({ groupId }: props) {
  const [searchValue, setSearchValue] = useState("")
  const [userResults, setUserResults] = useState<UserDB[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          setUserResults(typedData)
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='secondary-button'>
          Add Someone
        </Button>
      </DialogTrigger>
      <DialogContent style={{ minHeight: "250px" }}>
        <DialogHeader>
          <DialogTitle style={{ marginTop: "1em" }}>
            Add Someone
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className={styles.spacedRow} style={{ marginBottom: "1em" }}>
                <Input
                  placeholder='Search Users'
                  onChange={handleChange}
                  value={searchValue}
                />
              </div>
              <div id="users-container" className={styles.usersContainer}>
                {userResults.map((user) => (
                  <SingleUserSmall key={user._id} user={user} groupId={groupId} />
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}