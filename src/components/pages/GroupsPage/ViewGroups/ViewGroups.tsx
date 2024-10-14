// @ts-nocheck
import { useGetUserGroups } from "@/api/groups"
import { useAuth } from "@/context/auth/auth"
import { Group } from "dataTypes"
import { useQuery } from "react-query"
import SmallGroupCard from "../Components/SmallGroupCard"
import SmallGroupSkele from "../Components/SmallGroupSkele"


export default function ViewGroups() {
  const { user } = useAuth()

  type GroupsResponse = {
    groups: Group[]
  }

  const { data: groups, isLoading } = useGetUserGroups(user._id)

  if (isLoading) {
    <>
      <SmallGroupSkele />
      <SmallGroupSkele />
      <SmallGroupSkele />
    </>
  }

  return (
    <div>
      {groups && groups.length ? (

        groups.map((group) => (
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