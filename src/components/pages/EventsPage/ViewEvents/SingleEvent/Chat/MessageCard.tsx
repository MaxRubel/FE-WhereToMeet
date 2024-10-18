import { Message } from "dataTypes";
import styles from "./Styles.module.css";
import { formatDate } from "../../../../../../../utils/formatDate";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/auth";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteMessage } from "@/api/chat";

type props = {
  message: Message;
  sendEditData: Dispatch<SetStateAction<Message | null>>;
};

export default function MessageCard({ message, sendEditData }: props) {
  const { user } = useAuth();
  const isMine = user._id === message.userId;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteMessage = async () => {
    if (!message.id) {
      console.error("No ID was found in the chat message");
      return;
    }
    try {
      deleteMessage(message.id);
      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      id="row-positioning-wrapper"
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
      }}
    >
      <div className={`cool-card ${styles.messageCardContainer}`}>
        <div className={styles.avatarHeader}>
          <div className="left-col-avatar">
            <img
              className={styles.avatarPhoto}
              src={message.user?.avatarUrl}
              alt=""
            />
          </div>
          <div>
            <div>{message.user?.name}</div>
            {message.updated ? (
              <div className={styles.lilDate}>
                {formatDate(message.updated.toString())} editted
              </div>
            ) : (
              <div className={styles.lilDate}>
                {formatDate(message.created.toString())}
              </div>
            )}
          </div>
        </div>
        <div className={styles.messageText}>
          <div>{message.message}</div>

          {/* ---edit / delete your own messages--- */}
          {message.userId === user._id && (
            <div style={{ marginTop: ".5em" }}>
              <Button
                style={{ marginRight: ".5em" }}
                className="secondary-button"
                onClick={() => {
                  sendEditData(message);
                }}
              >
                Edit
              </Button>
              <Dialog open={deleteOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="deleteButton"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your message.
                    </DialogDescription>
                    <div
                      style={{ display: "flex", gap: ".5em", marginTop: "2em" }}
                    >
                      <Button
                        type="button"
                        className="deleteButton"
                        onClick={handleDeleteMessage}
                      >
                        Delete
                      </Button>
                      <Button
                        className="secondary-button"
                        onClick={() => {
                          setDeleteOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
