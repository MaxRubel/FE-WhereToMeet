import { useAuth } from "./context/auth/auth";
import LoginForm from "./components/forms/LoginForm/LoginForm";
import RegistrationForm from "./components/forms/RegistrationForm/RegistrationForm";
import Router from "./Route";
import Loading from "./components/Loading";
// reversing my mistakes

function App() {
  const { user, isGuest, isPublicRoute } = useAuth();

  if (isGuest || isPublicRoute) {
    return <Router />;
  }

  if (user === null || user === "fetching") {
    return <Loading />;
  } else if (user === "notLoggedIn") {
    return <LoginForm />;
  } else if (!user._id) {
    return <RegistrationForm />;
  } else {
    return <Router />;
  }
}

export default App;
