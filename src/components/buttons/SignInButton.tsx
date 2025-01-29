import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../context/auth/firebase";
import { useAuth } from "../../context/auth/auth";
import { checkUser } from "../../api/users";
import "./SignInButton.css";
import { Button } from "../ui/button";

export default function SignInButton() {
  const { setUser } = useAuth();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const googleUser = await signInWithPopup(auth, provider);

      if (googleUser) {
        setUser("fetching");
        localStorage.setItem("user", JSON.stringify(googleUser.user));
        checkUser({ uid: googleUser.user.uid }).then((resp: any) => {
          if (resp.userExists) {
            setUser({ ...resp.user, ...googleUser.user });
          } else {
            setUser(googleUser.user);
          }
        });
      }
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <div className="login-display">
      <div className="column left ">
        <img src="/wheretomeetlogo.webp" alt="Logo" className="minilogo" />

        <h1>Welcome to Where to Meet</h1>
        <p>Find your perfect meetup spot with us!</p>
        <Button className="sign-in-btn mt-3" onClick={signIn}>
          Login
        </Button>
      </div>
      <div className="column right text-white " id="login-right-container">
        {/* <img
          src="https://i.pinimg.com/474x/ab/3d/e2/ab3de2f5cc08f507f728f39c66e596b8.jpg"
          alt="Logo"
          className="logo"
        /> */}
        <h1 className="mt-3">What is Where to Meet?</h1>
        <p>
          Where to Meet is a platform for connecting and finding ideal meeting
          places for everyone.
        </p>
      </div>
    </div>
  );
}
