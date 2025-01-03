import { useEffect, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
} from "firebase/database";
import styles from "./Styles.module.css";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CancelButton,
  ChatIcon,
  UpArrow,
} from "@/components/graphics/Graphics1";
import { sendMessage, updateMessage } from "@/api/chat";
import { useAuth } from "@/context/auth/auth";
import MessageCard from "./MessageCard";
import { getChatUsers } from "@/api/users";
import { UserDB } from "dataTypes";
import type { Message } from "dataTypes";

type props = {
  eventId: string;
};

export default function Chat({ eventId }: props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const [isEditting, setIsEditting] = useState<Message | null>(null);
  const bottomWindowRef = useRef<HTMLDivElement>(null);

  //@ts-ignore loadingMessage will be used in the future
  const [loadingMessages, setLoadingMessages] = useState(true);

  const scrollToBottom = () => {
    if (bottomWindowRef.current) {
      const container = bottomWindowRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, "messages");

    const messageQuery = query(
      messagesRef,
      orderByChild("eventId"),
      equalTo(eventId)
    );

    const handleMessageUpdate = (snapshot: any) => {
      setLoadingMessages(true);
      try {
        const data = snapshot.val();

        if (!data) {
          setMessages([]);
          setLoadingMessages(false);
          return;
        }

        const dataArray: Message[] = [];

        // put the firebase key into each object and pushes the object into an array
        Object.entries<Message>(data).forEach(([fbKey, value]) => {
          dataArray.push({ ...value, id: fbKey });
        });

        // nothing was returned from fb
        if (dataArray.length === 0) {
          setMessages([]);
          setLoadingMessages(false);
          return;
        }

        //pull unqique User IDs from all the messages in array for faster Mongo querying
        const userIds = Array.from(
          new Set(dataArray.map((message) => message.userId))
        );

        // gets all the user data from Mongo from an array of userIds
        // and then adds user to each message
        getChatUsers({ users: userIds }).then((resp: any) => {
          const usersArray = resp.data as UserDB[];

          const updatedMessages = dataArray.map((msg) => ({
            ...msg,
            user: usersArray.find((item) => item._id === msg.userId),
          }));

          // sort chat messages by earliest to latest
          const sortedMessages = updatedMessages.sort((a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime()
          );

          setMessages(sortedMessages);
          setLoadingMessages(false);
        });
      } catch (err) {
        console.error("Error with Firebase DB listener:", err);
        setLoadingMessages(false);
      }
    };

    onValue(messageQuery, handleMessageUpdate);

    return () => {
      off(messageQuery, "value", handleMessageUpdate);
    };
  }, [eventId]);

  useEffect(()=>{
    scrollToBottom()
  },[messages])

  useEffect(() => {
    //  editting / updating chat message
    if (isEditting?.id) {
      setMessage(isEditting.message);
    } else {
      setMessage("");
    }
  }, [isEditting]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();

    const payload: Message = {
      eventId,
      message,
      userId: user._id,
      created: isEditting ? isEditting.created : new Date(),
      updated: isEditting ? new Date() : null,
      id: isEditting ? isEditting.id : null,
    };

    if (!isEditting) {
      try {
        await sendMessage(payload);
        setMessage("");
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await updateMessage(payload);
        setMessage("");
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleCancelEdit = () => {
    setMessage("");
    setIsEditting(null);
  };

  return (
    <div className={`cool-card ${styles.chatContainer}`}>
      {/* ----Header---- */}
      <div className={styles.chatHeader}>
        <h2 className={styles.chatHeaderWithIcon}>
          <ChatIcon size="20" />
          Chat
        </h2>
      </div>

      {/* ---- Messages Container ---- */}
      <div className={styles.messageContainer}>
        {messages.map((message) => (
          <div key={message.id}>
            <MessageCard message={message} sendEditData={setIsEditting} />
          </div>
        ))}
        <div ref={bottomWindowRef}/>
      </div>

      {/* ----Text Area---- */}
      <div className={styles.formWrapper}>
        <form className={styles.textDiv} onSubmit={handleSendMessage}>
          <Textarea
            placeholder="Say something..."
            value={message}
            id="chat-textarea"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            style={{
              paddingRight: "80px",
              height: "8em",
            }}
          />
          <Button
            style={{
              display: "flex",
              gap: "15px",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "1.5em",
              height: "55px",
            }}
          >
            <UpArrow size="20" />
          </Button>
          {isEditting && (
            <Button
              style={{
                display: "flex",
                gap: "15px",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "90px",
                height: "55px",
                color: "red",
              }}
              className="secondary-button"
              onClick={handleCancelEdit}
            >
              <CancelButton size="20" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
