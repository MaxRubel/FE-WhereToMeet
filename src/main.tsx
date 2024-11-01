import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthContextProvider from "./context/auth/auth.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import NavContextProvider from "./context/nav/NavContext.tsx";

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

  <AuthContextProvider>
    <NavContextProvider>
      <QueryClientProvider client={queryClient}>
        <React.StrictMode>
          <App />
          <ReactQueryDevtools />
        </React.StrictMode>
      </QueryClientProvider>
    </NavContextProvider>
  </AuthContextProvider>
);
