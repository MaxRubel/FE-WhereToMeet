import { ChangeEmailPrivatePayload, changeEmailSetting } from "@/api/users";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth/auth";
import styles from "../styles.module.css";

export default function EditPrivacyForm() {
  const { user } = useAuth();

  const handlePrivacy = async (e: boolean) => {
    const payload: ChangeEmailPrivatePayload = {
      userId: user._id,
      value: e,
    };

    try {
      console.log("changing privacy setting");
      await changeEmailSetting(payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.privacySettings}>
      <div className={styles.emailForm}>
        <div className={styles.formGroup}>
          <Switch
            id="privacy-switch"
            onCheckedChange={handlePrivacy}
            style={{ padding: "0px" }}
          />
          <Label htmlFor="privacy-switch">No Email Notificiations</Label>
        </div>
        <div style={{ width: "275px" }}>
          When enabled, you will not receive email notifications about upcoming
          event invitations.
        </div>
      </div>
    </div>
  );
}
