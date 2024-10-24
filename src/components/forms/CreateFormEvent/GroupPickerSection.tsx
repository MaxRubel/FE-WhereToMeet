import { useGetUserGroups } from "@/api/groups";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth/auth";
import { Event } from "dataTypes";
import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

type errors = {
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  private: string;
};

export type GroupSectionProps = {
  formFields: Event;
  setFormFields: Dispatch<SetStateAction<Event>>;
  errors: errors;
  setErrors: Dispatch<SetStateAction<errors>>;
};

export default function GroupPickerSection(props: GroupSectionProps) {
  const { formFields, setFormFields, errors, setErrors } = props;
  const { user } = useAuth();

  const { data: groups } = useGetUserGroups(user._id);

  const handleChange = (value: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      groupId: value,
    }));

    if (errors.private && value) {
      setErrors((preVal) => ({ ...preVal, private: "" }));
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: "3em" }}>
      <Label htmlFor="groupId" className="form-label">
        Group
      </Label>
      <div className={styles.errors}>{errors.private}</div>
      <Select
        name="groupId"
        value={formFields.groupId}
        onValueChange={handleChange}
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
  );
}
