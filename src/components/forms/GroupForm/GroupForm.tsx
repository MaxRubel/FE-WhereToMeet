import { Button } from "@/components/ui/button";
import "./RegistrationForm.css";
import { useAuth } from "@/context/auth/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Group } from "dataTypes";
import { createGroup } from "@/api/groups";
import MultiselectModal from "./Modal"; 

export type TheGroupForm = {
    _id: string; //primary key
    ownerId: string; //foreign key
    name: string;
    description: string;
    members: string[]; //array of _ids
}

const initErrors = {
    _id: "",
    ownerId: "",
    name: "",
    description: "",
    members: []
  };

const initFields: TheGroupForm = {
    _id: "",
    ownerId: "",
    name: "",
    description: "",
    members: []
  };

export default function GroupForm() {
    const { user, setUser } = useAuth();
    const [formFields, setFormFields] = useState<TheGroupForm>({
        ...initFields
      });
    const [errors, setErrors] = useState(initErrors);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors((preVal) => ({
          ...preVal,
          [name]: "",
        }));
        setFormFields((prevFields) => ({
          ...prevFields,
          [name]: value,
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload: Group = { ...formFields }

        createGroup(payload).then((resp: unknown) => {
          const typedResp = resp as Group
          const storeGroup = { ...user, ...typedResp };
          setUser(storeGroup);
          localStorage.setItem("group", JSON.stringify(storeGroup));
        });
    }

    return (
      <div className="form-container">
        <h2 className="form-title">Create a Group</h2>
        <form onSubmit={handleSubmit}>
          {/* NAME FIELD */}
          <div className="form-group">
            <Label htmlFor="name" className="form-label">
              Group Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formFields.name}
              onChange={handleChange}
              className="form-input"
              required
              aria-required="true"
              placeholder="Group Name"
            />
          </div>
  
          {/* DESCRIPTION */}
          <div className="form-group">
            <Label htmlFor="description" className="form-label">
              Description
            </Label>
            <Input
              type="text"
              id="description"
              name="description"
              className="form-input"
              required
              aria-required="true"
              value={formFields.description}
              placeholder="Grooup Details"
              onChange={handleChange}
            />
          </div>

          <MultiselectModal />

          <Button type="submit" className="submit-button" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </div>
    );
}
