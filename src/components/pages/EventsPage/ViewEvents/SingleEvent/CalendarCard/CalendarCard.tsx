import { CalendarIcon } from "@/components/graphics/Graphics1"
import { Event } from "dataTypes"

type props = {
  event: Event
}

//@ts-ignore
export default function CalendarCard({ event }: props) {

  return (
    <div className="cool-card flex gap-3">
      <CalendarIcon size="20" /> Calendar feature will be added soon...
    </div>
  )

}