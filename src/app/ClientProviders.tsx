// src/app/ClientProviders.tsx
"use client";

import { Provider } from "react-redux";
import store from "./store/store";
import { AuthProvider } from "./store/AuthContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}