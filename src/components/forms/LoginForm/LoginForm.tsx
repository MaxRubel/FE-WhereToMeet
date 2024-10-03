import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../context/auth/firebase";
import { useAuth } from "../../../context/auth/auth";


export default function LoginForm() {

  const { setUser } = useAuth()

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const googleUser = await signInWithPopup(auth, provider);
      if (googleUser) { setUser(googleUser) }
      localStorage.setItem("user", JSON.stringify(googleUser))
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <div>
      <button onClick={signIn}>Login</button>
    </div>
  )
}