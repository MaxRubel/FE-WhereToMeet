import { useAuth } from "./context/auth/auth";
import LoginForm from "./components/forms/LoginForm/LoginForm";
import RegistrationForm from "./components/forms/RegistrationForm/RegistrationForm";
import Router from "./Route";
import { GridLoader } from "react-spinners";

function App() {
  const { user, isGuest, isPublicRoute, isLoading } = useAuth();

  if (isLoading) {
    return <GridLoader />;
  }

  if (isGuest || isPublicRoute) {
    return <Router />;
  }

  if (user === null) {
    return <GridLoader />;
  }

  if (user === "notLoggedIn") {
    return <LoginForm />;
  } else if (!user._id) {
    setTimeout(() =>  <RegistrationForm/>, 6000); 
  //  <RegistrationForm />;
  } else {
    return <Router />;
  }

  return <Router />;
}

export default App;
