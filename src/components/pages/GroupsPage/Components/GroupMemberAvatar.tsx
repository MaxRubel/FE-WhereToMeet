import { Group, UserDB } from "dataTypes"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth/auth"

type props = {
  member: UserDB
  group: Group
}

export default function GroupMemberAvatar({ member, group }: props) {
  const { user } = useAuth();

  return (
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
          <p style={{ fontWeight: "600" }}>
            {member.name}
          </p>
          <p>{member.email}</p>
          {group.ownerId === user._id &&
            <Button style={{
              backgroundColor: "rgb(176, 4, 4)",
              height: "25px",
              marginTop: "10px"
            }}>
              Remove From Group
            </Button>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}