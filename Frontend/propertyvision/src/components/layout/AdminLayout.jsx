import { useState,useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Building2,
  Users,
  Layers,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  useEffect( async ()=>{
    const getRole = await localStorage.getItem('role')
    console.log(getRole)
  },[])


  const menu = [
    { name: "Dashboard", icon: Home, path: "dashboard", requiresAdmin: role === 'admin' ? true : false },
    { name: "Accounts Management", icon: Home, path: "accounts-management", requiresAdmin: true },
    { name: "Properties", icon: Building2, path: "properties", requiresAdmin: true },
    { name: "Tenants", icon: Users, path: "tenants", requiresAdmin: true },
    { name: "Units / Flats", icon: Layers, path: "units", requiresAdmin: true },
    { name: "Payments", icon: CreditCard, path: "payments", requiresAdmin: true },
    { name: "Reports", icon: BarChart3, path: "reports", requiresAdmin: true },
    { name: "Settings", icon: Settings, path: "settings", requiresAdmin: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Super Admin</h1>
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              onClick={() => setOpen(false)} // 👈 auto close on mobile hello
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                ${isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white px-4 sm:px-6 py-4 border-b">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <h2 className="text-base sm:text-lg font-semibold">Admin Panel</h2>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-600">
              Admin
            </span>
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
