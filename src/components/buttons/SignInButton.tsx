import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../context/auth/firebase";
import { useAuth } from "../../context/auth/auth";
import { checkUser } from "../../api/users";
import { Button } from "../ui/button";
import { GridLoader } from "react-spinners";
import { useState } from "react";

export default function SignInButton() {
  const { setUser } = useAuth();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false)

  const signIn = async () => {
    setIsLoaderVisible(true);
    const provider = new GoogleAuthProvider();
    try {
      const googleUser = await signInWithPopup(auth, provider);

      if (googleUser) {
        //@ts-ignore
        setUser(googleUser.user);
        localStorage.setItem("user", JSON.stringify(googleUser.user));
        checkUser({ uid: googleUser.user.uid }).then((resp: any) => {
          if (resp.userExists) {
            setIsLoaderVisible(false)
            setUser({ ...resp.user, ...googleUser.user });
          }
        });
      }
    } catch (error) {
      console.error("Error signing in", error);
    } finally{
      setIsLoaderVisible(false)
    }
  };

  if(isLoaderVisible){
    return <GridLoader/>
  }

  else {return (
    <div>
      
      <div className="login-display">
      <div className="column left ">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRJRGaLyKPCb2DopKU-IPVylyxUODEdgHmLA&s" alt="Logo" className="minilogo" /> 

        <h1>Welcome to Where to Meet</h1>
        <p>Find your perfect meetup spot with us!</p> 
        <Button className="sign-in-btn mt-3" onClick={signIn}>Connect with Google</Button>
      </div>
      <div className="column right">
      <img src="https://i.pinimg.com/474x/ab/3d/e2/ab3de2f5cc08f507f728f39c66e596b8.jpg" alt="Logo" className="logo" /> 
        <h1 className="mt-3">What is Where to Meet?</h1>
        <p>Where to Meet is a platform for connecting and finding ideal meeting places for everyone.</p>
        
      </div>
       </div>
    </div>
    
  );
}
  
  
}
