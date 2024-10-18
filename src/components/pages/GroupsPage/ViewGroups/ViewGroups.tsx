import { useGetUserGroups } from "@/api/groups";
import { useAuth } from "@/context/auth/auth";
import { Group } from "dataTypes";
import SmallGroupCard from "../Components/SmallGroupCard";

export default function ViewGroups() {
  const { user } = useAuth();
  const { data: groups, isLoading } = useGetUserGroups(user._id);
  console.log("this is my user_id", user.id);
  console.log("this is my groups", groups)

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