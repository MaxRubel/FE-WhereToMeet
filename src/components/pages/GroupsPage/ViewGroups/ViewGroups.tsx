import { useGetUserGroups } from "@/api/groups";
import { Group } from "dataTypes";
import SmallGroupCard from "../Components/SmallGroupCard";
import { useAuth } from "@/context/auth/auth";

export default function ViewGroups() {
  const { user } = useAuth()
  const { data: groups, isLoading } = useGetUserGroups(user._id);

  if (isLoading) {
    return (
      <>
        {/* <SmallGroupSkele />
        <SmallGroupSkele />
        <SmallGroupSkele /> */}
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
        <div className="text-left">
          <h2 style={{ fontWeight: 300 }}>No groups have been created yet...</h2></div>
      )}
    </div>
  );
}