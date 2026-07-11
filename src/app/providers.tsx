import { AuthProvider } from "@/features/auth";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";

type Props = {
  children?: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children ?? <AppRoutes />}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
