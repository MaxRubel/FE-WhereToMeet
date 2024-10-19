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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./EventForm.css";

interface CreateEventFormProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  event?: any;
  onUpdate?: (eventData: any) => void;
}

export default function CreateEventForm({
  isModal = false,
  isOpen = false,
  onClose,
  event,
  onUpdate,
}: CreateEventFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [groups, setGroups] = useState<any[]>([]);
  const [formFields, setFormFields] = useState({
    name: "",
    groupId: "",
    description: "",
    suggestions: [],
    messages: [],
    locationName: "",
    locationUrl: "",
    locationStreet: "",
    locationZipcode: 0,
    locationLat: 0,
    locationLong: 0,
  });

  useEffect(() => {
    if (event) {
      const eventTime = event.time ? new Date(event.time) : undefined;
      setDate(eventTime);
      setTime(eventTime ? format(eventTime, "HH:mm") : "");
      setFormFields({
        name: event.name || "",
        groupId: event.groupId || "",
        description: event.description || "",
        suggestions: event.suggestions || [],
        messages: event.messages || [],
        locationName: event.location?.name || "",
        locationUrl: event.location?.url || "",
        locationStreet: event.location?.address.street || "",
        locationZipcode: event.location?.address.zipcode || 0,
        locationLat: event.location?.address.coordinates.lat || 0,
        locationLong: event.location?.address.coordinates.long || 0,
      });
    }
  }, [event]);

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

    const formattedDate = date ? `${format(date, "yyyy-MM-dd")}T${time}` : "";
    const payload = {
      _id: event?._id || "",
      name: formFields.name,
      ownerId: event?.ownerId || user._id,
      suggestionsEnabled: event?.suggestionsEnabled ?? true,
      chatEnabled: event?.chatEnabled ?? false,
      groupId: formFields.groupId,
      private: false,
      location: {
        name: formFields.locationName,
        url: formFields.locationUrl,
        address: {
          street: formFields.locationStreet,
          zipcode: formFields.locationZipcode,
          coordinates: {
            lat: formFields.locationLat,
            long: formFields.locationLong,
          },
        },
      },
      description: formFields.description,
      time: formattedDate,
      suggestions: formFields.suggestions,
      messages: formFields.messages,
      address: event?.address || {
        street: "",
        city: "",
        zip: "",
      },
    };

    if (isModal && onUpdate) {
      onUpdate(payload);
      onClose?.();
    } else {
      type response = {
        _id: string;
      };

      createEvent(payload).then((resp) => {
        const typedresp = resp as response;
        navigate(`/events/${typedresp._id}`);
      });
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className={cn(!isModal && "create-event-form", isModal && "modal-form")}
      style={!isModal ? { marginTop: "2em" } : undefined}
    >
      <div className="form-group">
        <Label htmlFor="name" className="form-label">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formFields.name}
          onChange={handleChange}
          placeholder="Birthday Party"
          className="form-input"
          required
          aria-required="true"
        />
      </div>

      <div className="form-group">
        <Label htmlFor="groupId" className="form-label">
          Group
        </Label>
        <Select
          name="groupId"
          value={formFields.groupId}
          onValueChange={(value) =>
            setFormFields((prevFields) => ({ ...prevFields, groupId: value }))
          }
        >
          <SelectTrigger className="form-input">
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
      </div>

      <div className="form-group">
        <Label htmlFor="description" className="form-label">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formFields.description}
          onChange={handleChange}
          placeholder="Join us for a celebration!"
          className="form-input"
          aria-required="false"
        />
      </div>

      <div className="form-group">
        <Label className="form-label">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("form-input justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="form-group">
        <Label htmlFor="time" className="form-label">
          Time
        </Label>
        <Input
          type="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="form-input w-[240px]"
        />
      </div>

      <Label className="form-label">Location</Label>
      <div className="form-group">
        <Label htmlFor="locationName" className="form-label">
          Name
        </Label>
        <Input
          type="text"
          name="locationName"
          value={formFields.locationName}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <Label htmlFor="locationUrl" className="form-label">
          Website
        </Label>
        <Input
          type="url"
          name="locationUrl"
          value={formFields.locationUrl}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <Label htmlFor="locationStreet" className="form-label">
          Street
        </Label>
        <Input
          type="text"
          name="locationStreet"
          value={formFields.locationStreet}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <Label htmlFor="locationZipcode" className="form-label">
          Zipcode
        </Label>
        <Input
          type="number"
          name="locationZipcode"
          value={formFields.locationZipcode}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <Label htmlFor="locationLat" className="form-label">
          Latitude
        </Label>
        <Input
          type="number"
          name="locationLat"
          value={formFields.locationLat}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <Label htmlFor="locationLong" className="form-label">
          Longitude
        </Label>
        <Input
          type="number"
          name="locationLong"
          value={formFields.locationLong}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <Button type="submit" style={{ marginTop: "1em" }}>
        {event ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );

  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="create-event-form-container">
      <h2 className="text-left" style={{ fontWeight: "300" }}>
        Create an Event
      </h2>
      {formContent}
    </div>
  );
}
