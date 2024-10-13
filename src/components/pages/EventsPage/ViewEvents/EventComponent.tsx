import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SafeRender = ({ value }) => {
  if (value === null || value === undefined) return 'not available'

  if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
}

interface EventComponentProps {
  event: Event;
}

const EventComponent: React.FC<EventComponentProps> = ({ event }) => {

  if (!event || typeof event !== 'object') {
    return <p>Error: Invalid event data</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name || 'not avail'}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <p>Description: <SafeRender value={event.description} /></p>
        <p>Location: <SafeRender value={event.location?.name || event.location} /></p>
        <p>Time: <SafeRender value={event.time} /></p>
        {event.location?.url && <p>URL: <SafeRender value={event.location.url} /></p>}
      </CardContent>
      <CardFooter>
        <p>{event.time || 'not avail'}</p>
      </CardFooter>
  </Card>

  )
}
export default EventComponent;
// export type Event = {
//   _id: string; //primary key
//   ownerId: string; //foreign key
//   groupId: string; //foreign key

//   description: string;
//   location: Location;
//   time: string; // datetime string

//   suggestions: Location[];
//   messages: Message[];
// };
