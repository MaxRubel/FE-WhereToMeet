import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./EditProfileForm.css"
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard } from "@radix-ui/react-hover-card";
import QuestionMark from "@/components/graphics/QuestionMark";
import { SCROLL_OVER_WAIT_TIME } from "../../../../AppSettings"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/auth";
import { updateUser } from "@/api/users";

export type EditUserFields = {
  name: string;
  phone: number;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: number;
  private: boolean;
}

const initFields = {
  name: "",
  phone: 0,
  email: "",
  street: "",
  city: "",
  state: "",
  zip: 0,
  private: true
}

type pointerOver = {
  address: boolean,
  phone: boolean,
  street: boolean,
}

export default function EditProfileForm() {
  const { user } = useAuth()
  const [formFields, setFormFields] = useState<EditUserFields>(
    //@ts-ignore
    { ...initFields, email: user?.email })
  // const [errors, setErrors] = useState({})
  const [phoneOver, setPhoneOver] = useState(false)
  const [pointerOver, setPointerOver] = useState<pointerOver>({
    address: false,
    phone: false,
    street: false
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // setErrors((preVal) => ({
    //   ...preVal,
    //   [name]: "",
    // }));
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formFields)

    //@ts-ignore
    const userId = user._id
    updateUser(formFields, userId).then((data) => { console.log(data) })
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
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
                  }, SCROLL_OVER_WAIT_TIME);
                }}
              >
                <QuestionMark />
              </div>
              <Card
                className="small-over-text"
                style={{
                  display: phoneOver ? "block" : "none",
                  zIndex: "10"
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
          {/* <span className="error">{errors.phone && errors.phone}</span> */}
        </div>

        {/* ADDRESS HEADER */}
        <HoverCard>
          <Label htmlFor="street" className="form-label">
            <h3 className="text-left"
              style={{ margin: "1em 0em", fontWeight: "700" }}>
              Address
            </h3>
            <div
              className="centered"
              onMouseEnter={() => {
                setPointerOver((preVal) => ({ ...preVal, street: true }))
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setPointerOver((preVal) => ({ ...preVal, street: false }))
                }, SCROLL_OVER_WAIT_TIME);
              }}
            >
              <QuestionMark />
            </div>
            <Card
              className="small-over-text"
              style={{
                display: pointerOver.street ? "block" : "none",
                zIndex: "10",
              }}
            >
              <CardHeader>
                <CardTitle>Optional</CardTitle>
                <CardDescription>
                  This is an optional field. We use your address to find out the best place for a group to meet.  It is not required.
                </CardDescription>
              </CardHeader>
            </Card>
          </Label>
        </HoverCard>

        {/* STREET FIELD */}
        <div className="form-group">
          <Label htmlFor="street" className="form-label">
            Street
          </Label>
          <Input
            type="text"
            id="street"
            name="street"
            value={formFields.street}
            onChange={handleChange}
            className="form-input"
            aria-required="false"
            placeholder="116 N. Main St."
          />
        </div>

        <div className="edit-profile-split-row">
          {/* CITY FIELD */}
          <div className="form-group">
            <Label htmlFor="city" className="form-label">
              City
            </Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formFields.city}
              onChange={handleChange}
              className="form-input"
              aria-required="false"
              placeholder="New York"
            />
          </div>

          {/* STATE FIELD */}
          <div className="form-group">
            <Label htmlFor="state" className="form-label">
              State
            </Label>
            <Input
              type="text"
              id="state"
              name="state"
              value={formFields.state}
              onChange={handleChange}
              className="form-input"
              aria-required="false"
              placeholder="116 N. Main St."
            />
          </div>
        </div>


        <div className="edit-profile-split-row">
          {/* ZIP FIELD */}
          <div className="form-group">
            <Label htmlFor="zip" className="form-label">
              Zip Code
            </Label>
            <Input
              type="text"
              id="zip"
              name="zip"
              value={formFields.zip ? formFields.zip : ""}
              onChange={handleChange}
              className="form-input"
              aria-required="false"
              placeholder="01324"
            />
          </div>
        </div>
      </div>
      <div className="edit-profile-button-row">
        <Button type="submit">Submit</Button>
        <Button
          type="button"
          className="secondary-button"
          onClick={handleCancel}>Cancel</Button>
      </div>
    </form>
  )
}