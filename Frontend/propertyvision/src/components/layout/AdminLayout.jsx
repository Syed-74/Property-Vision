import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Building2,
  Layers,
  LayoutGrid,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../AuthContext/AuthContext";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  /* ================= MENU ================= */
  const menu = [
    {
      name: "Dashboard",
      icon: Home,
      path: "dashboard",
      requiresAdmin: true,
    },
    {
      name: "Properties",
      icon: Building2,
      path: "properties",
      requiresAdmin: true,
    },
    {
      name: "Add Floor",
      icon: Layers,
      path: "floors",
      requiresAdmin: true,
    },
    {
      name: "Units / Flats",
      icon: LayoutGrid,
      path: "units",
      requiresAdmin: true,
    },
    {
      name: "Tenants",
      icon: Users,
      path: "tenants",
      requiresAdmin: true,
    },
    {
      name: "Payments",
      icon: CreditCard,
      path: "payments",
      requiresAdmin: true,
    },
    {
      name: "Labor Registration",
      icon: Users,
      path: "labor",
      requiresAdmin: true,
    },

    {
      name: "Settings",
      icon: Settings,
      path: "settings",
      requiresAdmin: true,
    },
    {
      name: "Accounts Management",
      icon: UserCog,
      path: "accounts-management",
      requiresAdmin: user?.role !== "subadmin",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-bold text-[#9c4a1a]">Super Admin</h1>
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menu
            .filter((item) => item.requiresAdmin)
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#9c4a1a] text-white"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-[#9c4a1a]"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4
            text-sm font-medium text-gray-700 rounded-lg
            hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
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
              {user?.role || "Admin"}
            </span>
            <div
              className="h-9 w-9 rounded-full bg-[#9c4a1a] text-white
              flex items-center justify-center font-semibold"
            >
              {user?.name?.[0] || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
