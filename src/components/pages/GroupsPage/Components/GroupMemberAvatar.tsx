import { Group, UserDB } from "dataTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/auth";
import { useRemoveGroupMember } from "@/api/groups";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type props = {
  member: UserDB;
  group: Group;
};

export default function GroupMemberAvatar({ member, group }: props) {
  const { user } = useAuth();
  const removeMember = useRemoveGroupMember();
  const [imgError, setImgError] = useState(false);

  const handleRemoveUser = () => {
    if (!group._id || !member._id) {
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to remove this person from your group?"
      )
    ) {
      const payload = { groupId: group._id, memberId: member._id };
      removeMember.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `${member.name} has been removed from your group.`,
            className: "toastty",
          });
        },
      });
    }
  };

  return (
    <TooltipProvider key={member._id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            {imgError ? (
              <img
                src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"
                alt={"group member avatar"}
                className="h-12 w-12 rounded-full object-cover cursor-pointer bg-background"
              />
            ) : (
              <img
                src={member.avatarUrl ? member.avatarUrl : user.photoURL}
                alt={"group member avatar"}
                className="h-12 w-12 rounded-full object-cover cursor-pointer bg-background"
                onError={() => {
                  setImgError(true);
                }}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-black shadow-md rounded-md p-2">
          <p style={{ fontWeight: "600" }}>{member.name}</p>
          <p>{member.email}</p>
          {group.ownerId === user._id && group.ownerId !== member._id && (
            <Button
              style={{
                backgroundColor: "rgb(176, 4, 4)",
                height: "25px",
                marginTop: "10px",
              }}
              onClick={handleRemoveUser}
            >
              Remove From Group
            </Button>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
