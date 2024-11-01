import { useCreateGroup, useGetUserGroups } from "@/api/groups";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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

type NewGroupResp = {
  data: {
    insertedId: string
  }
}

const initNewGroupForm = {
  name: "",
  description: ""
}

export default function GroupPickerSection(props: GroupSectionProps) {
  const { formFields, setFormFields, errors, setErrors } = props;
  const { user } = useAuth();
  const [groupsFormOpen, setGroupsFormOpen] = useState(false)
  const { data: groups } = useGetUserGroups(user._id);
  const [newGroupFields, setNewGroupFields] = useState(initNewGroupForm)
  const queryClient = useQueryClient()

  const createGroup = useCreateGroup()

  useEffect(() => {
    setNewGroupFields({ name: "", description: "" })
  }, [groupsFormOpen])

  const handleChange = (value: string) => {
    if (value === "createNewGroup") {
      setGroupsFormOpen(true)
      return
    }
    setFormFields((prevFields) => ({
      ...prevFields,
      groupId: value,
    }));

    if (errors.private && value) {
      setErrors((preVal) => ({ ...preVal, private: "" }));
    }
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewGroupFields((preVal) => ({ ...preVal, [name]: value }))
  }

  const handleOpenChange = (e: boolean) => {
    if (!e) {
      setGroupsFormOpen(false)
    }
  }

  const handleSubmitGroup = () => {

    const payload = { ...newGroupFields, ownerId: user._id, members: [] };

    //@ts-ignore
    createGroup.mutate(payload, {
      onSuccess: () => {
        setGroupsFormOpen(false);
        toast({
          title: "Success!",
          description: "Your group has been created.",
          className: "toastty",
        });
      },
      onError: (err) => {
        console.warn(err)
      },
      onSettled: async (resp) => {
        const typedResp = resp as NewGroupResp
        const groupId = typedResp.data.insertedId

        // waits for the user's groups to refetch before
        // automatically filling the select dropdown
        while (queryClient.isFetching() > 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        setFormFields((preVal) => ({ ...preVal, groupId }))
      }
    })
  }

  return (
    <>
      <div className="form-group" style={{ marginBottom: "3em" }}>
        <Label htmlFor="groupId" className="form-label">
          Group <span style={{ fontStyle: "italic" }}>required</span>
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
            <SelectItem value="createNewGroup" className="font-semibold">
              + Create a New Group
            </SelectItem>
            {groups?.map((group: any) => (
              <SelectItem key={group._id} value={group._id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>



      {/* ----New Group Modal---- */}
      <Dialog open={groupsFormOpen} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="Create Group Modal">
          <DialogHeader>
            <DialogTitle >Create a New Group</DialogTitle>
            <form
              className="create-group-form"
              style={{ marginTop: "2em" }}
            >
              {/* NAME FIELD */}
              <div className="form-group">
                <Label htmlFor="name" className="form-label">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newGroupFields.name}
                  onChange={handleGroupChange}
                  className="form-input"
                  required
                  aria-required="true"
                  placeholder="Taco Tuesday Crew"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <Label htmlFor="description" className="form-label">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="form-input"
                  aria-required="false"
                  aria-describedby="description of group"
                  value={newGroupFields.description}
                  placeholder="We like to eat tacos on Tuesdays."
                  onChange={handleGroupChange}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                style={{ marginTop: "1em" }}
                type="button"
                disabled={createGroup.isPending}
                onClick={handleSubmitGroup}
              >
                Submit
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
