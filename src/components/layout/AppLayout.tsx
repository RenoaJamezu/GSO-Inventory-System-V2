import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Outlet />
    </main>
  );
}