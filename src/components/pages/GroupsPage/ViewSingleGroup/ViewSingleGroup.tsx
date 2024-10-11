import { getSingleGroup } from "@/api/groups"
import { Group } from "dataTypes"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type props = {
  groupId: string
}

export default function ViewSingleGroup({ groupId }: props) {
  const [thisGroup, setThisGroup] = useState<Group | null>(null)

  useEffect(() => {
    if (!groupId) {
      console.error("No group ID supplied in URL Param")
      return
    }

    try {
      getSingleGroup(groupId).then((resp) => {
        const typedResp = resp as Group
        setThisGroup(typedResp)
      })
    } catch (err) {
      console.error("error fetching single group", err)
    }
  }, [])

  if (!thisGroup) {
    return "Loading"
  }

  return (
    <div>
      {thisGroup?.name}
    </div>
  )
}