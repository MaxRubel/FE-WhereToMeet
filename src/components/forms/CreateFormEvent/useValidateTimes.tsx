import { Event } from "dataTypes";
import { Dispatch } from "react";

interface EventErrors {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  private: string;
}

interface ValidationResult {
  hasError: boolean;
  updatedFields?: Partial<Event>;
}

function normalizeDate(date: string | Date): Date {
  const dateF = new Date(date);
  return new Date(dateF.getFullYear(), dateF.getMonth(), dateF.getDate());
}

function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  return d1.getTime() === d2.getTime();
}

export function validateDateTimeState(formFields: Event): EventErrors {
  const { startDate, endDate, startTime, endTime } = formFields;
  const errors: EventErrors = {
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    private: ""
  };

  // Only validate if we have any date/time fields filled
  if (startDate || endDate || startTime || endTime) {
    // Check if start date is before today
    if (startDate) {
      const today = normalizeDate(new Date());
      const startDateNormalized = normalizeDate(startDate);
      if (startDateNormalized < today) {
        errors.startDate = "Start date cannot be earlier than today's date";
      }
    }

    if (startTime && !startDate) {
      errors.startDate = "Date is required";
    }

    if (endTime && !endDate) {
      errors.endDate = "End date is required";
    }

    if (endDate && !startDate) {
      errors.startDate = "Start date is required";
    }

    if (startDate && endDate) {
      const startDateNormalized = normalizeDate(startDate);
      const endDateNormalized = normalizeDate(endDate);
      
      if (endDateNormalized < startDateNormalized) {
        errors.endDate = "End date cannot be earlier than start date";
      }

      // If same day, validate times
      if (isSameDay(startDate, endDate) && startTime && endTime) {
        if (startTime > endTime) {
          errors.endTime = "End time must be later than start time";
        }
      }
    }
  }

  return errors;
}

export function useValidateTimes(
  setErrors: Dispatch<React.SetStateAction<EventErrors>>,
  formFields: Event,
  input: string | Date,
  type: string,
  _setFormFields: Dispatch<React.SetStateAction<Event>>
): ValidationResult {
  let newFields: Partial<Event> = {};

  // First, set the new value
  switch (type) {
    case "startTime":
      newFields.startTime = input as string;
      break;
    case "endTime":
      newFields.endTime = input as string;
      break;
    case "startDate":
      newFields.startDate = input as Date;
      break;
    case "endDate":
      newFields.endDate = input as Date;
      break;
  }

  // Create a temporary state with the new value
  const tempState = {
    ...formFields,
    ...newFields
  };

  // Validate the entire state
  const newErrors = validateDateTimeState(tempState);
  setErrors(newErrors);

  // Check if there are any errors
  const hasErrors = Object.values(newErrors).some(error => error !== "");
  
  if (hasErrors) {
    return { hasError: true };
  }

  // If no errors, include any additional field updates for time conflicts
  if (type === "startDate" && formFields.endDate && formFields.startTime && formFields.endTime) {
    if (isSameDay(input, formFields.endDate) && formFields.startTime > formFields.endTime) {
      newFields.endTime = "";
    }
  }

  if (type === "endDate" && formFields.startDate && formFields.startTime && formFields.endTime) {
    if (isSameDay(input, formFields.startDate) && formFields.startTime > formFields.endTime) {
      newFields.endTime = "";
    }
  }

  return {
    hasError: false,
    updatedFields: newFields
  };
}