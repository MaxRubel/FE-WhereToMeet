import { useAuth } from "@/context/auth/auth";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "@/api/events";

import { Textarea } from "@/components/ui/textarea";

const emptyLocation = {
    name: "",
    url: "xvideos.com",
    address: {
      street: "",
      zipcode: 0,
      coordinates: {
        lat: 0,
        long: 0,
      },
    },
    votes: [],
  };

export default function CreateEventForm(){
    const { user} = useAuth();
    const navigate = useNavigate();
    

    const initFields ={
        ownerId : user.id,
        groupId: null,
        description : "",
        time : "10/10/2024",
        suggestions: [],
        messages: []

    }
    const [formFields, setFormFields] = useState(initFields)

    const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value} = e.target;
        setFormFields((prevFields) =>({
            ...prevFields,
            [name]: value,
        }));
    };
    

    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            _id : "",
            ownerId : user.uid,
            groupId: '',
            location: emptyLocation,
            description : formFields.description,
            time : "10/10/2024",
            suggestions: [],
            messages: []

        }

        createEvent(payload).then((data) =>{
            console.log(data);
            navigate('/')
        })

    }

    return(
        <form onSubmit={handleSubmit}>
            <h2 className="text-left"> Create An Event</h2>
            <div className="form-group">
          <Label htmlFor="name" className="form-label">
            description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formFields.description}
            onChange={handleChange}
            className="h-40"
            required
            aria-required="true"
            placeholder="add the description"

          />
          
        </div>
        <Button type="submit" onClick={handleSubmit}>Create</Button>
        </form>
    )
}