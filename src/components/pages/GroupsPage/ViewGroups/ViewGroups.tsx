// @ts-nocheck
import { getUserGroups } from "@/api/groups"
import { useAuth } from "@/context/auth/auth"
import { Group } from "dataTypes"
import { useQuery } from "react-query"
import SmallGroupCard from "../Components/SmallGroupCard"


export default function ViewGroups() {
  const { user } = useAuth()

  type GroupsResponse = {
    groups: Group[]
  }

  //@ts-ignore
  const { data: groups, isLoading } = useQuery<GroupsResponse[]>({
    queryKey: ['groups', user._id],
    queryFn: () => getUserGroups(user._id),
    enabled: !!user._id,
    staleTime: 0,
    cacheTime: 0,
  });

  if (isLoading) {
    return ""
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