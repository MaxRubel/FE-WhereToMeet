import './App.css'
import { useAuth } from './context/auth/auth'
import LoginForm from './components/forms/LoginForm/LoginForm'
import RegistrationForm from './components/forms/RegistrationForm/RegistrationForm'
import Router from './Route'

function App() {
  const { user } = useAuth()

  if (user === null) {
    return <LoginForm />
  } else if (user === "unregistered") {
    return <RegistrationForm />
    //@ts-ignore
  } else if (user._id) {
    return <Router />
  }
}

export default App
