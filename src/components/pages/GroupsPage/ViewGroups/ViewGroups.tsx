import { useGetUserGroups } from "@/api/groups";
import { useAuth } from "@/context/auth/auth";
import { Group } from "dataTypes";
import SmallGroupCard from "../Components/SmallGroupCard";
import SmallGroupSkele from "../Components/SmallGroupSkele";

export default function ViewGroups() {
  const { user } = useAuth();
  const { data: groups, isLoading } = useGetUserGroups(user._id);

  if (isLoading) {
    return (
      <>
        <SmallGroupSkele />
        <SmallGroupSkele />
        <SmallGroupSkele />
      </>
    );
  }

  return (
    <div>
      {groups && groups.length > 0 ? (
        groups.map((group: Group) => (
          <SmallGroupCard
            key={group._id}
            group={group}
          />
        ))
      ) : (
        <div>No groups have been created yet...</div>
      )}
    </div>
  );
}