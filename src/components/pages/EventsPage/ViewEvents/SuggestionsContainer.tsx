import { Event } from "dataTypes"
import styles from "./EventStyles.module.css"

interface props {
  event: Event
}

//@ts-ignore   event will be used shortly
export default function SuggestionsContainer({ event }: props) {

  return (
    <>
      <div className={styles.suggestionsContainer}>
        <div className={styles.headerContainer}>
          <h3 style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>Suggestions</h3>
        </div>
      </div>
    </>
  )
}