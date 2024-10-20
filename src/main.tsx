import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthContextProvider from "./context/auth/auth.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //@ts-ignore
      cacheTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(

  <QueryClientProvider client={queryClient}>
    {/* <React.StrictMode> */}
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
    <ReactQueryDevtools />
    {/* </React.StrictMode> */}
  </QueryClientProvider>

);
