import { useEffect, useState } from "react";
import { getDatabase, ref, query, orderByChild, equalTo, onValue, off } from "firebase/database";
import styles from "./Styles.module.css"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UpArrow } from "@/components/graphics/Graphics1";
import { MessagePayload, SendMessage } from "@/api/chat";
import { useAuth } from "@/context/auth/auth";

type props = {
  eventId: string
}

type Mesasge = {
  message: string
  userId: string
  eventId: string
  id: string
}

export default function Chat({ eventId }: props) {
  const [messages, setMessages] = useState<Mesasge[]>([])
  const [message, setMessage] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, 'messages');
    const messageQuery = query(messagesRef, orderByChild('eventId'), equalTo(eventId));

    const handleMessageUpdate = (snapshot: any) => {
      const data = snapshot.val();
      if (data) setMessages(Object.values(data))
      console.log("received :", Object.values(data))
    };

    onValue(messageQuery, handleMessageUpdate);

    return () => {
      off(messageQuery, 'value', handleMessageUpdate);
    };
  }, [eventId]);

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()

    const payload: MessagePayload = {
      eventId, message, userId: user._id
    }
    try {

      SendMessage(payload)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={`cool-card ${styles.chatContainer}`}>

      {/* ----Header---- */}
      <div className={styles.chatHeader}>
        <h2 style={{ fontWeight: 500, fontSize: "1.2em", }}>
          Chat
        </h2>
      </div>

      {/* ---- Messages Container ---- */}
      <div className={styles.messageContainer}>
        {messages.map((message) => (
          <div key={message.id}>{message.message}</div>
        ))}
      </div>

      {/* ----Text Area---- */}
      <form className={styles.textDiv} onSubmit={handleSendMessage}>
        <Textarea
          placeholder="Say something..."
          onChange={(e) => { setMessage(e.target.value) }}
        />
        <Button
          style={{ display: 'flex', gap: '15px' }}
        >
          Submit <UpArrow size="20" />
        </Button>
      </form>
    </div>
  )
}