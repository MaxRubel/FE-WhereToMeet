import { getUserGroups } from "@/api/groups"
import { useAuth } from "@/context/auth/auth"
import { Group } from "dataTypes"
import { useQuery } from "react-query"
import { GridLoader } from "react-spinners"
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
    refetchOnMount: false,
    enabled: !!user._id,
  });

  if (isLoading) {
    return <GridLoader />
  }

  return (
    <div>
      {/* @ts-ignore */}
      {groups?.map((group) => (
        <SmallGroupCard key={group._id} group={group} />
      ))}
    </div>
  )
}