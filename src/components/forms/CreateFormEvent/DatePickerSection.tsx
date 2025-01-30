import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import styles from "./styles.module.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Event } from "dataTypes";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useValidateTimes } from "./useValidateTimes";
import { initErrors } from "./CreateFormEvent";
import { useState } from "react";

type errorsType = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  private: string;
};

export type DatePickerSectionProps = {
  formFields: Event;
  errors: errorsType;
  setErrors: React.Dispatch<React.SetStateAction<errorsType>>;
  setFormFields: React.Dispatch<React.SetStateAction<Event>>;
};

export default function DatePickerSection(props: DatePickerSectionProps) {
  const {
    formFields,
    errors,
    setErrors,
    setFormFields,
  } = props;

  const [dateOpen, setDateOpen] = useState(
    formFields?.startDate ? true : false
  );

  // useEffect(() => {
  //   // close date picker
  //   function handleClickOut(e: PointerEvent) {
  //     if ((e.target as HTMLElement)?.id !== "date-picker") {
  //       if (startDateOpen) {
  //         setStartDateOpen(false);
  //       }
  //       if (endDateOpen) {
  //         setEndDateOpen(false);
  //       }
  //     }
  //   }

  //   document.addEventListener("pointerdown", handleClickOut);
  //   return () => {
  //     document.removeEventListener("pointerdown", handleClickOut);
  //   };
  // }, [startDateOpen, endDateOpen]);

  const handleStartDate = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    const result = useValidateTimes(setErrors, formFields, newDate, "startDate", setFormFields);

    if (!result.hasError && result.updatedFields) {
      setFormFields((preVal) => ({
        ...preVal,
        ...result.updatedFields
      }));
    }
  };

  const handleEndDate = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    const result = useValidateTimes(setErrors, formFields, newDate, "endDate", setFormFields);

    if (!result.hasError && result.updatedFields) {
      setFormFields((preVal) => ({
        ...preVal,
        ...result.updatedFields
      }));
    }
  };

  const handleStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const result = useValidateTimes(setErrors, formFields, value, "startTime", setFormFields);

    if (!result.hasError && result.updatedFields) {
      setFormFields((preVal) => ({
        ...preVal,
        ...result.updatedFields
      }));
    }
  };

  const handleEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const result = useValidateTimes(setErrors, formFields, value, "endTime", setFormFields);
    if (!result.hasError && result.updatedFields) {
      setFormFields((preVal) => ({
        ...preVal,
        ...result.updatedFields
      }));
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

  return (
    <Accordion
      type="single"
      className="border-none"
      collapsible
      value={dateOpen ? "item-1" : ""}
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger onClick={handleDateAccordian}>
          {dateOpen ? "Remove Date -" : "Add Date +"}
        </AccordionTrigger>
        <AccordionContent
          style={{
            marginTop: "1em",
            padding: "1em",
          }}
        >
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "form-input justify-start text-left font-normal w-[240px]"
                      )}
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "form-input justify-start text-left font-normal w-[240px]"
                      )}
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
  );
}
