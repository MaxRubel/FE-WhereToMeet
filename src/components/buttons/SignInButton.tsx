import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../context/auth/firebase";
import { useAuth } from "../../context/auth/auth";
import { checkUser } from "../../api/users";

export default function SignInButton() {
  const { setUser } = useAuth();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const googleUser = await signInWithPopup(auth, provider);

      if (googleUser) {
        //@ts-ignore
        setUser(googleUser.user);
        console.log({ googleUser })
        localStorage.setItem("user", JSON.stringify(googleUser.user));
        checkUser({ uid: googleUser.user.uid }).then((resp: any) => {
          if (resp.userExists) {
            setUser({ ...resp.user, ...googleUser.user });
          }
        });
      }
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <div>
      <button onClick={signIn}>Login</button>
    </div>
  );
}
