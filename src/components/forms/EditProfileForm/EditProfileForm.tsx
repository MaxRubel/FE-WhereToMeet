import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./EditProfileForm.css"
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard } from "@radix-ui/react-hover-card";
import QuestionMark from "@/components/graphics/QuestionMark";

export default function EditProfileForm() {
  const [formFields, setFormFields] = useState({ name: "" })
  const [errors, setErrors] = useState({})
  const [phoneOver, setPhoneOver] = useState(false)

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
    <>
      <h2 className="text-left">Edit Profile</h2>
      <div className="edit-profile-fields">

        {/* NAME FIELD */}
        <div className="form-group">
          <Label htmlFor="name" className="form-label">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formFields.phone}
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
            value={formFields.email}
            onChange={handleChange}
            className="form-input"
            required
            aria-required="false"
            placeholder="Your email"
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
      </div>
    </>
  )
}