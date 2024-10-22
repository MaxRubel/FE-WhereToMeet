import { Event } from "dataTypes";
import { Dispatch } from "react";

interface EventErrors {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export function useValidateTimes(
  setErrors: Dispatch<React.SetStateAction<EventErrors>>,
  formFields: Event,
  input: string | Date,
  type: string,
  setFormFields: Dispatch<React.SetStateAction<Event>>
): boolean {
  const { startTime, endTime, startDate, endDate } = formFields;

  if (type === "startTime") {
    //no start date when start time is added
    if (!startDate) {
      setErrors((preVal) => ({ ...preVal, startDate: "Date is required" }));
      return true;
    } else {
      setErrors((preVal) => ({ ...preVal, startDate: "" }));
    }

    // if event starts and ends on the same day, start time must be earlier than end time
    if (endDate && startDate === endDate && endTime && input > endTime) {
      setErrors((preVal) => ({
        ...preVal,
        startTime: "Start time must be earlier than end time.",
      }));
      return true;
    }
  }

  if (type === "endTime") {
    //no end date when end time is added
    console.log({ input, startTime });
    console.log(startDate?.getDate() === endDate?.getDate());
    if (!endDate) {
      setErrors((preVal) => ({
        ...preVal,
        endDate: "You must enter the date first.",
      }));
      return true;
    }

    if (!startDate) {
      setErrors((preVal) => ({
        ...preVal,
        startDate: "You must enter the date first.",
      }));
      return true;
    }

    if (!startTime) {
      setErrors((preVal) => ({
        ...preVal,
        startTime: "You must enter a start time first.",
      }));
      return true;
    }

    // if event starts and ends on the same day, end time must be later than start time
    if (startDate.getDate() === endDate.getDate() && input < startTime) {
      console.log("yes");
      setErrors((preVal) => ({
        ...preVal,
        endTime: "End time must be later than start time.",
      }));
      return true;
    }
  }

  if (type === "startDate") {
    if (endDate && input > endDate) {
      setErrors((preVal) => ({
        ...preVal,
        startDate: "Start date must be earlier than end date.",
      }));
      return true;
    } else {
      setErrors((preVal) => ({ ...preVal, startDate: "" }));
    }

    if (startTime && endTime && startTime > endTime) {
      setErrors((preVal) => ({
        ...preVal,
        startTime: "Start time must be earlier than end time.",
      }));
      setFormFields((preVal) => ({ ...preVal, endTime: "", endDate: null }));
      return true;
    }
  }

  if (type === "endDate") {
    if (!startDate) {
      setErrors((preVal) => ({
        ...preVal,
        startDate: "You must enter an start date first.",
      }));
      return true;
    }
    if (input < startDate) {
      setErrors((preVal) => ({
        ...preVal,
        endDate: "End date must be later than start date.",
      }));
      return true;
    }

    if (startTime && endTime && startTime > endTime) {
      setErrors((preVal) => ({
        ...preVal,
        startTime: "Start time must be earlier than end time.",
      }));
      setFormFields((preVal) => ({ ...preVal, endTime: "", endDate: null }));
      return true;
    }
  }

  return false;
}
