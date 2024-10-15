import { useAuth } from "@/context/auth/auth";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getUserGroups } from "@/api/groups";
import { useNavigate } from "react-router-dom";
import { createEvent } from "@/api/events";
import { Textarea } from "@/components/ui/textarea";

const emptyLocation = {
  name: "",
  url: "xvideos.com",
  address: {
    street: "",
    zipcode: 0,
    coordinates: {
      lat: 0,
      long: 0,
    },
  },
  votes: [],
};

export default function CreateEventForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>(""); // New state for time
  const [groups, setGroups] = useState<any[]>([]);
  const [formFields, setFormFields] = useState({
    name: "",
    groupId: "",
    description: "",
    suggestions: [],
    messages: [],
  });

  useEffect(() => {
    getUserGroups(user._id)
      .then((gp) => {
        const groups = gp as any[];
        setGroups(groups);
      })
      .catch((error) => {
        console.error("Error fetching user groups:", error);
      });
  }, [user._id]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = date ? `${format(date, "yyyy-MM-dd")}T${time}` : ""; // Combine date and time
    const payload = {
      _id: "",
      name: formFields.name,
      ownerId: user._id,
      groupId: formFields.groupId,
      location: emptyLocation,
      description: formFields.description,
      time: formattedDate,
      suggestions: [],
      messages: [],
    };

    type response = {
      _id: string;
    };

    createEvent(payload).then((resp) => {
      const typedresp = resp as response;
      navigate(`/events/${typedresp._id}`);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-left">Create An Event</h2>
      <div className="form-group" style={{ marginTop: "2em" }}>
        {/* Event Name */}
        <Label htmlFor="name" className="form-label">
          Name
        </Label>
        <Input
          type="text"
          placeholder="Add the name of the event"
          name="name"
          value={formFields.name}
          onChange={handleChange}
        />

        {/* Group Selection */}
        <Label
          htmlFor="groupId"
          className="form-label"
          style={{ marginTop: "2em" }}
        >
          {" "}
          {/* Added margin for spacing */}
          Group
        </Label>
        <Select
          name="groupId"
          value={formFields.groupId}
          onValueChange={(value) =>
            setFormFields((prevFields) => ({ ...prevFields, groupId: value }))
          }
        >
          <SelectTrigger className="form-select w-full">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group._id} value={group._id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Event Description */}
        <Label
          htmlFor="description"
          className="form-label mt-4"
          style={{ marginTop: "2em" }}
        >
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formFields.description}
          onChange={handleChange}
          className="h-20 text-left mt-2 w-full"
          required
          aria-required="true"
          placeholder="Add the description"
        />

        {/* Date Picker */}
        <div className="form-label" style={{ marginTop: "2em" }}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal mt-4"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span className="text-black">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 text-black" align="start">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <Label htmlFor="time" className="form-label mt-4">
          Select Time:
        </Label>
        <Input
          type="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="form-input text-left w-48"
          placeholder="Hours:Minutes:Seconds"
        />
      </div>

      <div className="form-label">
        <Button type="submit" className="mt-6">
          Create
        </Button>
      </div>
    </form>
  );
}
