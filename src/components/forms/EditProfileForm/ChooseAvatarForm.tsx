import { AvatarPicker } from "@/components/menus/avatarPicker/AvatarPicker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import styles from "./EditProfileForm.module.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth/auth";
import { AvatarPayload, updateAvatar } from "@/api/users";
import { useToast } from "@/hooks/use-toast";

export default function ChooseAvatarForm() {
  const [selection, sendSelection] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCancel = () => {
    navigate("/");
  };

  const submit = (value: string) => {
    const payload: AvatarPayload = {
      id: user._id,
      avatarUrl: value,
    };
    updateAvatar(payload).then(() => {
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (input) {
      submit(input);
    } else if (selection) {
      submit(selection);
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-left">Choose an Avatar</h2>
      <AvatarPicker sendSelection={sendSelection} />
      <div className="custom-avatar" style={{ marginTop: "3em" }}>
        <h2 className="text-left">Or choose your own!</h2>
        <Label
          htmlFor="Image URL"
          className="form-label"
          style={{ marginTop: "1em" }}
        >
          Image URL{" "}
          <span style={{ fontStyle: "italic", marginLeft: "1em" }}>
            (optional)
          </span>
        </Label>
        <Input
          className="red-background"
          placeholder="https://i.etsystatic.com/34654177/r/il/22f3d1/4057574661/il_570xN.4057574661_iesx.jpg"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          type="url"
          value={input}
        />
      </div>
      <div className={styles.buttonRow}>
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
        <Button
          type="button"
          className="secondary-button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
