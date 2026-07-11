import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function AppLayout() {
  // const { pathname } = useLocation(); 

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <Header title={getPageTitle(pathname)} /> */}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
