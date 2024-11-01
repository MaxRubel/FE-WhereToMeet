import { useAuth } from "@/context/auth/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateEvent, useUpdateEvent } from "@/api/events";
import { Textarea } from "@/components/ui/textarea";
import "./EventForm.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Event } from "dataTypes";
import { BackArrow } from "@/components/graphics/Graphics1";
import styles from "./styles.module.css";
import DatePickerSection, { DatePickerSectionProps } from "./DatePickerSection";
import GroupPickerSection, { GroupSectionProps } from "./GroupPickerSection";
import { Switch } from "@/components/ui/switch";

interface CreateEventFormProps {
  event?: Event;
  setIsViewing?: Dispatch<SetStateAction<string>>;
}

export const initErrors = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  private: "",
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
    invites: [],
  };

  const [formFields, setFormFields] = useState<Event>(
    event ? event : initEvent
  );

  const [locationOpen, setLocationOpen] = useState(
    event?.location.name ? true : false
  );

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

    if (formFields.private && !formFields.groupId) {
      setErrors((preVal) => ({
        ...preVal,
        private: "Please select a group for your private event",
      }));
      return;
    }

    if (event && setIsViewing) {
      //  update
      updateEvent.mutate(formFields, {
        onSuccess: () => {
          setIsViewing("singleEvent");
        },
      });
    } else {
      // create
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

  const handlePrivate = (e: boolean) => {
    const clearError = () => {
      setErrors((preVal) => ({ ...preVal, private: "" }));
    };

    setFormFields((preVal) => ({ ...preVal, private: e }));

    if (e === false) {
      setFormFields((preVal) => ({ ...preVal, groupId: "" }));
      if (errors.private) {
        clearError();
      }
    }
  };

  //basic form validation:
  let needsRestOfAddress;
  street ? (needsRestOfAddress = true) : (needsRestOfAddress = false);

  const datePickerProps: DatePickerSectionProps = {
    setStartDateOpen,
    setEndDateOpen,
    formFields,
    errors,
    startDateOpen,
    endDateOpen,
    setErrors,
    setFormFields,
  };

  const groupSectionProps: GroupSectionProps = {
    formFields,
    setFormFields,
    errors,
    setErrors,
  };

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

      {/* ---Privacy Switch--- */}
      {!event && (
        <div style={{ marginBottom: "2em", marginTop: "1em" }}>
          <div className={styles.switchDiv}>
            <Label htmlFor="private-switch">Public Event</Label>
            <Switch
              id="private-switch"
              style={{ padding: "0px" }}
              onCheckedChange={handlePrivate}
              checked={formFields.private}
            />
            <Label htmlFor="private-switch">Private Event</Label>
          </div>
          <div className={styles.privateExplain}>
            A public event will be viewable by anyone with the link. A private
            event will only be viewable by members of a group.
          </div>
        </div>
      )}

      {!event && formFields.private && (
        <GroupPickerSection {...groupSectionProps} />
      )}
      <DatePickerSection {...datePickerProps} />

      {/* ---Location Section--- */}
      <Accordion type="single" collapsible value={locationOpen ? "item-1" : ""}>
        <AccordionItem value="item-1" className="border-b-0">
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
    <div
      className="create-event-form-container"
      style={{ paddingLeft: event ? "2em" : "0em" }}
    >
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
