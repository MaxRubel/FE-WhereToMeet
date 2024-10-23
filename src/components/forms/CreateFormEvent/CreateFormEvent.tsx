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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateEvent, useUpdateEvent } from "@/api/events";
import { Textarea } from "@/components/ui/textarea";
import "./EventForm.css";
import { useGetUserGroups } from "@/api/groups";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Event } from "dataTypes";
import { BackArrow } from "@/components/graphics/Graphics1";
import styles from "./styles.module.css";
import { useValidateTimes } from "./useValidateTimes";

interface CreateEventFormProps {
  event?: Event;
  setIsViewing?: Dispatch<SetStateAction<string>>;
}

const initErrors = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
};

export default function CreateEventForm({
  event,
  setIsViewing,
}: CreateEventFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [errors, setErrors] = useState(initErrors);

  const initEvent: Event = {
    _id: "",
    name: "",
    ownerId: user._id,
    groupId: "",
    private: false,
    suggestionsEnabled: true,
    chatEnabled: true,
    description: "",
    location: {
      name: "",
      url: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipcode: 0,
        coordinates: {
          lat: 0,
          long: 0,
        },
      },
    },
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    suggestions: [],
    messages: [],
  };

  useEffect(() => {
    // close date picker
    function handleClickOut(e: PointerEvent) {
      if ((e.target as HTMLElement)?.id !== "date-picker") {
        if (startDateOpen) {
          setStartDateOpen(false);
        }
        if (endDateOpen) {
          setEndDateOpen(false);
        }
      }
    }

    document.addEventListener("pointerdown", handleClickOut);
    return () => {
      document.removeEventListener("pointerdown", handleClickOut);
    };
  }, [startDateOpen, endDateOpen]);

  const [formFields, setFormFields] = useState<Event>(
    event ? event : initEvent
  );
  const [dateOpen, setDateOpen] = useState(event?.startDate ? true : false);

  const [locationOpen, setLocationOpen] = useState(
    event?.location.name ? true : false
  );
  const { data: groups, isLoading } = useGetUserGroups(user._id);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "street" ||
      name === "city" ||
      name === "state" ||
      name === "zipcode"
    ) {
      setFormFields((preVal) => ({
        ...preVal,
        location: {
          ...preVal.location,
          address: { ...preVal.location.address, [name]: value },
        },
      }));
    } else if (name === "url") {
      setFormFields((preVal) => ({
        ...preVal,
        location: { ...preVal.location, url: value },
      }));
    } else if (name === "locationName") {
      setFormFields((preVal) => ({
        ...preVal,
        location: { ...preVal.location, name: value },
      }));
    } else {
      setFormFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleStartDate = (newDate: Date | undefined) => {
    if (!newDate) return;
    setErrors(initErrors);
    if (
      useValidateTimes(
        setErrors,
        formFields,
        newDate,
        "startDate",
        setFormFields
      )
    ) {
      return;
    }
    setFormFields((prevFields) => ({
      ...prevFields,
      startDate: newDate,
    }));
    setStartDateOpen(false);
  };

  const handleEndDate = (newDate: Date | undefined) => {
    if (!newDate) return;
    setErrors(initErrors);
    if (
      useValidateTimes(setErrors, formFields, newDate, "endDate", setFormFields)
    ) {
      return;
    }
    setFormFields((prevFields) => ({
      ...prevFields,
      endDate: newDate || null,
    }));

    setEndDateOpen(false);
  };

  const handleStartTime = (e: any) => {
    setErrors(initErrors);
    const { value } = e.target;
    if (
      useValidateTimes(setErrors, formFields, value, "startTime", setFormFields)
    ) {
      return;
    }
    setFormFields((preVal) => ({ ...preVal, startTime: value }));
  };

  const handleEndTime = (e: any) => {
    setErrors(initErrors);
    const { value } = e.target;
    if (
      useValidateTimes(setErrors, formFields, value, "endTime", setFormFields)
    ) {
      return;
    }
    setFormFields((preVal) => ({ ...preVal, endTime: value }));
  };

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    Object.values(errors).forEach((error) => {
      if (error) {
        window.alert("Please fill in the required fields.");
        return;
      }
    });

    if (event && setIsViewing) {
      //  update
      updateEvent.mutate(formFields, {
        onSuccess: () => {
          setIsViewing("singleEvent");
        },
      });
    } else {
      //  create
      createEvent.mutate(formFields, {
        onSuccess: (response) => {
          navigate(`/events/${response._id}`);
        },
      });
    }
  };

  const { street, city, zipcode, state } = formFields.location.address;
  const { name } = formFields.location;

  const handleAccordian = () => {
    // this nasty looking logic will ask you to confirm before
    // closing the location tab and deleting the info if there is any data in there.
    if (locationOpen) {
      if (
        (street || city || zipcode || state || name) &&
        window.confirm(
          "Are you sure you want to remove this location from the event?"
        )
      ) {
        setFormFields((preVal) => ({
          ...preVal,
          location: {
            name: "",
            url: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipcode: 0,
              coordinates: {
                lat: 0,
                long: 0,
              },
            },
          },
        }));
        setLocationOpen(false);
      } else {
        // if no info then just close it.
        setLocationOpen(false);
      }
    } else {
      setLocationOpen(true);
    }
  };

  const handleDateAccordian = () => {
    if (dateOpen) {
      if (
        formFields.startDate &&
        window.confirm("Are you sure you want to remove this date information")
      ) {
        setFormFields((preVal) => ({
          ...preVal,
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
        }));
        setDateOpen(false);
        setErrors(initErrors);
      } else if (!formFields.startDate) {
        setDateOpen(false);
        setErrors(initErrors);
      }
    } else {
      setDateOpen(true);
    }
  };

  //basic form validation:
  let needsRestOfAddress;
  street ? (needsRestOfAddress = true) : (needsRestOfAddress = false);

  if (isLoading) {
    return <></>;
  }

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className="create-event-form"
      style={{ marginTop: "2em" }}
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

      {/* ---group selection--- */}
      {!event && (
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
              {groups?.map((group: any) => (
                //@ts-ignore will not be undefined
                <SelectItem key={group._id} value={group._id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Accordion type="single" collapsible value={dateOpen ? "item-1" : ""}>
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={handleDateAccordian}>
            {dateOpen ? "Remove Date -" : "Add Date +"}
          </AccordionTrigger>
          <AccordionContent style={{ marginTop: "1em", padding: "1em" }}>
            {/* ---start time--- */}
            <div className={styles.dates}>
              <div className="colLeft">
                <div className="form-group">
                  <Label className="form-label">
                    Start Date
                    {errors.startDate && (
                      <span style={{ color: "red", marginLeft: "10px" }}>
                        {errors.startDate}
                      </span>
                    )}
                  </Label>
                  <Popover open={startDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "form-input justify-start text-left font-normal w-[240px]"
                        )}
                        onClick={() => {
                          setStartDateOpen(true);
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formFields.startDate ? (
                          format(formFields.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        id="date-picker"
                        selected={
                          formFields.startDate
                            ? new Date(formFields.startDate)
                            : undefined
                        }
                        onSelect={handleStartDate}
                        initialFocus
                        required={formFields.startTime ? true : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="form-group">
                  <Label htmlFor="start-time" className="form-label">
                    Start Time
                    {errors.startTime && (
                      <span style={{ color: "red", marginLeft: "10px" }}>
                        {errors.startTime}
                      </span>
                    )}
                  </Label>
                  <Input
                    type="time"
                    name="startTime"
                    id="start-time"
                    value={formFields.startTime}
                    onChange={handleStartTime}
                    className="form-input w-[240px]"
                  />
                </div>
              </div>

              {/* ---end time--- */}
              <div className="colLeft">
                <div className="form-group">
                  <Label className="form-label">
                    End Date
                    {errors.endDate && (
                      <span style={{ color: "red", marginLeft: "10px" }}>
                        {errors.endDate}
                      </span>
                    )}
                  </Label>
                  <Popover open={endDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "form-input justify-start text-left font-normal w-[240px]"
                        )}
                        onClick={() => {
                          setEndDateOpen(true);
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formFields.endDate ? (
                          format(formFields.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        id="date-picker"
                        selected={
                          formFields.endDate
                            ? new Date(formFields.endDate)
                            : undefined
                        }
                        onSelect={handleEndDate}
                        required={formFields.endTime ? true : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="form-group">
                  <Label htmlFor="end-time" className="form-label">
                    End Time
                    {errors.endTime && (
                      <span style={{ color: "red", marginLeft: "10px" }}>
                        {errors.endTime}
                      </span>
                    )}
                  </Label>
                  <Input
                    type="time"
                    name="endTime"
                    id="end-time"
                    value={formFields.endTime}
                    onChange={handleEndTime}
                    className="form-input w-[240px]"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* ---Location Section--- */}
      <Accordion type="single" collapsible value={locationOpen ? "item-1" : ""}>
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={handleAccordian}>
            {locationOpen ? "Remove Location -" : "Add Location +"}
          </AccordionTrigger>
          <AccordionContent style={{ padding: "1em" }}>
            <div className="form-group">
              <Label
                style={{ marginTop: "1em" }}
                htmlFor="locationName"
                className="form-label"
              >
                Location Name
              </Label>
              <Input
                type="text"
                id="locationName"
                name="locationName"
                value={formFields.location.name}
                onChange={handleChange}
                className="form-input"
                required={locationOpen}
              />
            </div>

            <div className="form-group">
              <Label htmlFor="url" className="form-label">
                Website <span className={styles.optional}>optional</span>
              </Label>
              <Input
                type="url"
                id="url"
                name="url"
                value={formFields.location.url}
                onChange={handleChange}
                className="form-input"
                aria-required="false"
              />
            </div>
            <div className={styles.splitRow}>
              <div className="form-group">
                <Label htmlFor="street" className="form-label">
                  Street
                </Label>
                <Input
                  type="text"
                  id="street"
                  name="street"
                  value={formFields.location.address.street}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="city" className="form-label">
                  City
                </Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formFields.location.address.city}
                  onChange={handleChange}
                  className="form-input"
                  required={needsRestOfAddress}
                />
              </div>
            </div>

            <div className={styles.splitRow}>
              <div className="form-group">
                <Label htmlFor="state" className="form-label">
                  State
                </Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  maxLength={2}
                  style={{ width: "80px" }}
                  value={formFields.location.address.state}
                  onChange={handleChange}
                  className="form-input"
                  required={needsRestOfAddress}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="zipcode" className="form-label">
                  Zip
                </Label>
                <Input
                  type="number"
                  id="zipcode"
                  name="zipcode"
                  value={
                    formFields.location.address.zipcode
                      ? formFields.location.address.zipcode
                      : ""
                  }
                  style={{ width: "200px" }}
                  onChange={handleChange}
                  className="form-input"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={5}
                  required={needsRestOfAddress}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div style={{ display: "flex", gap: "1em", marginTop: "1.5em" }}>
        <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
        {event && setIsViewing && (
          <Button
            type="button"
            className="secondary-button"
            onClick={() => {
              setIsViewing("singleEvent");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  return (
    <div className="create-event-form-container">
      {/* ---top button row--- */}
      {event && setIsViewing && (
        <div style={{ marginBottom: "2em" }}>
          <Button
            className="secondary-button"
            onClick={() => {
              setIsViewing("singleEvent");
            }}
            style={{ display: "flex", gap: "10px" }}
          >
            <BackArrow size="18" />
            Back to your event
          </Button>
        </div>
      )}

      <h2 className="text-left" style={{ fontWeight: "300" }}>
        {event ? "Edit Event" : "Create an Event"}
      </h2>
      {formContent}
    </div>
  );
}
