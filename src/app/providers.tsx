import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import AppRoutes from "./router";

type Props = {
  children?: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{children ?? <AppRoutes />}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
