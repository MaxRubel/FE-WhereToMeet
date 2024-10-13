import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function EventComponent({ event }) {
  console.warn(event.description);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.description}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <p>{event.location}</p>
      </CardContent>
      <CardFooter>
        <p>{event.time}</p>
      </CardFooter>
  </Card>

  )
}
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
