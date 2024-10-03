import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../context/auth/firebase';
import { useAuth } from '../../context/auth/auth';

export default function Home() {
  const { setUser } = useAuth()

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null)
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}