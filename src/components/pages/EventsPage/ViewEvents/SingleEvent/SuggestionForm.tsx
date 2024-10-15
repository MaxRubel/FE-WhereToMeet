import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Event, Suggestion } from "dataTypes"
import { useState } from "react"
import styles from "../EventStyles.module.css"
import { Textarea } from "@/components/ui/textarea"

type props = {
  event: Event
}

export const initSuggestion: Suggestion = {
  name: "",
  description: "",
  url: "",
  address: {
    street: "",
    city: "",
    zipcode: 0,
    coordinates: {
      lat: 0,
      long: 0,
    },
  },
  votes: []
}


//@ts-ignore   event will be used shortly
export default function SuggestionForm({ event }: props) {
  const [formFields, setFormFields] = useState<Suggestion>(initSuggestion);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "street" || name === "zipcode" || name === "city") {
      setFormFields((preVal) => ({
        ...preVal,
        address: { ...preVal.address, [name]: value }
      }))
    } else {
      setFormFields((preVal) => ({ ...preVal, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Add Suggestion</Button>
      </DrawerTrigger>

      <DrawerContent
        style={{
          padding: "2em 4em",
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle style={{
              fontWeight: "400",
              textAlign: 'left',
            }}>
              Add A Suggestion
            </DrawerTitle>

            <div style={{ textAlign: "left", minWidth: "350px" }}>

              <div style={{ marginTop: "1.5em" }}>
                {/* ---Name Field--- */}
                <Label htmlFor="name" style={{ textAlign: 'left' }}>
                  Name
                </Label>
                <Input
                  id="name"
                  required
                  name="name"
                  aria-required="true"
                  value={formFields.name}
                  onChange={handleChange}
                  className={styles.smallInput}
                />
              </div>

              {/* ----Description---- */}
              <div style={{ marginTop: '1em' }}>
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  required
                  aria-required="true"
                  value={formFields.description}
                  name="description"
                  onChange={handleChange}
                  className={styles.smallInput}
                />
              </div>
            </div>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row justify-start space-x-1">
            <DrawerClose asChild>
              <Button type="submit">Submit</Button>
            </DrawerClose>
            <DrawerClose>
              <Button type="button" className="secondary-button">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}