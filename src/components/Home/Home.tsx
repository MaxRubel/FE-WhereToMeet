import { RefObject, useRef } from 'react';
import SignOutButton from '../buttons/SignOutButton';

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER

export default function Home() {
  const buttonRef: RefObject<HTMLButtonElement> = useRef(null);

  const handleTestEndpoint = async () => {
    try {
      const resp = await fetch(endpoint)
      console.warn(resp)
      if (buttonRef.current) {
        buttonRef.current.style.backgroundColor = "Green"
        buttonRef.current.style.color = "white"
      }
    } catch (err) {
      console.error("Not connecting to endpoint: ", err)
      if (buttonRef.current) {
        buttonRef.current.style.backgroundColor = "red"
        buttonRef.current.style.color = "white"
      }
    }
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={handleTestEndpoint} ref={buttonRef}>
        Test Server Endpoint
      </button>
      <SignOutButton />
    </div>
  )
}