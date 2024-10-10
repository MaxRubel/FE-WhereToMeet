import { Button } from "@/components/ui/button";
import "./RegistrationForm.css";
import { useAuth } from "@/context/auth/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import validator from "validator";
import { registerUser } from "@/api/users";
import { HoverCard } from "@radix-ui/react-hover-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QuestionMark from "@/components/graphics/QuestionMark";
import { UserDB, emptyUserDB } from "../../../../dataTypes";

export type RegisterUserForm = {
  name: string;
  email: string;
  phone: string;
};

const initErrors = {
  name: "",
  email: "",
  phone: "",
};

const initFields: RegisterUserForm = {
  name: "",
  email: "",
  phone: "",
};

export default function RegistrationForm() {
  const { user, setUser, checkUserFunc } = useAuth();
  const [formFields, setFormFields] = useState<RegisterUserForm>({
    ...initFields, email: user.email
  });
  const [errors, setErrors] = useState(initErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneOver, setPhoneOver] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    //checks phone number
    const isValidPhoneNumber = validator.isMobilePhone(formFields.phone);
    if (formFields.phone && !isValidPhoneNumber) {
      setErrors((preVal) => ({ ...preVal, phone: "Invalid Number" }));
      return;
    }

    const payload: UserDB = { ...emptyUserDB, ...formFields, uid: user.uid }

    registerUser(payload).then((resp: unknown) => {
      const typedResp = resp as UserDB
      const storeUser = { ...user, ...typedResp };
      setUser(storeUser);
      checkUserFunc()
      localStorage.setItem("user", JSON.stringify(storeUser));
    });
  };

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
  };

  return (
    <div className="form-container" style={{ marginTop: '3em' }}>
      <h2 className="form-title">Sign Up</h2>
      <form onSubmit={handleSubmit}>
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
            placeholder="Your name"
          />
        </div>

        {/* EMAIL FIELD */}
        <div className="form-group">
          <Label htmlFor="email" className="form-label">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            className="form-input"
            required
            aria-required="true"
            value={formFields.email}
            placeholder="Your email"
            onChange={handleChange}
          />
        </div>

        {/* PHONE FIELD */}
        <div className="form-group">
          <HoverCard>
            <Label htmlFor="phone" className="form-label">
              Phone
              <div
                onMouseEnter={() => {
                  setPhoneOver(true);
                }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    setPhoneOver(false);
                  }, 3000);
                }}
              >
                <QuestionMark />
              </div>
              <Card
                className="small-over-text"
                style={{
                  display: phoneOver ? "block" : "none",
                }}
              >
                <CardHeader>
                  <CardTitle>Optional</CardTitle>
                  <CardDescription>
                    This is an optional field. We use this information to send
                    you notifications about events you are hosting or attending.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Label>
          </HoverCard>

          <Input
            type="number"
            id="phone"
            name="phone"
            className="form-input"
            aria-required="true"
            value={formFields.phone ? formFields.phone : ""}
            placeholder="Your phone"
            onChange={handleChange}
          />
          <span className="error">{errors.phone && errors.phone}</span>
        </div>
        <Button type="submit" className="submit-button" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </div>
  );
}
