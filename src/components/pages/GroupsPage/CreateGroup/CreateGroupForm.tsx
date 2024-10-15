import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateGroup } from "@/api/groups";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import "./GroupForm.css";

export type GroupForm = {
  _id?: string; //primary key
  ownerId: string; //foreign key
  name: string;
  description: string;
  members: string[]; //array of _ids
};

type props = {
  setIsViewing: (arg0: string) => void;
};

export default function CreateGroupForm({ setIsViewing }: props) {
  const { user } = useAuth();

  const initFields: GroupForm = {
    ownerId: user._id,
    name: "",
    description: "",
    members: [],
  };

  const [formFields, setFormFields] = useState<GroupForm>(initFields);
  const createGroupMutation = useCreateGroup();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    type response = {
      message: string;
      data: {
        dateCreated: string;
        insertedId: string;
      };
    };

    const payload = {
      ...formFields,
      members: [
        {
          _id: user._id,
          joined: new Date(),
        },
      ],
    };

    createGroupMutation.mutate(payload, {
      onSuccess: (data: unknown) => {
        const typedData = data as response;
        setIsViewing("ViewSingleGroup");
        navigate(`/groups/${typedData.data.insertedId}`);
      },
    });
  };

  return (
    // HEADER
    <div className="create-group-form-container">
      <h2 className="text-left" style={{ fontWeight: "300" }}>
        Create a Group
      </h2>
      <form
        className="create-group-form"
        onSubmit={handleSubmit}
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
            value={formFields.name}
            onChange={handleChange}
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
            value={formFields.description}
            placeholder="We like to eat tacos on Tuesdays."
            onChange={handleChange}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          style={{ marginTop: "1em" }}
          type="submit"
          disabled={createGroupMutation.isLoading}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
