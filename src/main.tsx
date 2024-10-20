import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthContextProvider from "./context/auth/auth.tsx";
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnMount: 'always',
      retry: 3,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(

  <QueryClientProvider client={queryClient}>
    {/* <React.StrictMode> */}
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
    {/* </React.StrictMode> */}
  </QueryClientProvider>

);
