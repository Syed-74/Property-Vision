// import { useState } from "react";
// import { Outlet, NavLink } from "react-router-dom";
// import {
//   Menu,
//   X,
//   Home,
//   Building2,
//   Users,
//   Layers,
//   CreditCard,
//   BarChart3,
//   Settings,
// } from "lucide-react";

// const AdminLayout = () => {
//   const [open, setOpen] = useState(false);

//   const menu = [
//     { name: "Dashboard", icon: Home, path: "/" },
//     { name: "Properties", icon: Building2, path: "/properties" },
//     { name: "Tenants", icon: Users, path: "/tenants" },
//     { name: "Units / Flats", icon: Layers, path: "/units" },
//     { name: "Payments", icon: CreditCard, path: "/payments" },
//     { name: "Reports", icon: BarChart3, path: "/reports" },
//     { name: "Settings", icon: Settings, path: "/settings" },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform 
//         ${open ? "translate-x-0" : "-translate-x-full"} 
//         md:translate-x-0 transition-transform duration-300`}
//       >
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <h1 className="text-xl font-bold text-indigo-600">Super Admin</h1>
//           <button className="md:hidden" onClick={() => setOpen(false)}>
//             <X />
//           </button>
//         </div>

//         <nav className="p-4 space-y-1">
//           {menu.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               end
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-3 rounded-lg transition
//                 ${
//                   isActive
//                     ? "bg-indigo-600 text-white"
//                     : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
//                 }`
//               }
//             >
//               <item.icon size={20} />
//               <span>{item.name}</span>
//             </NavLink>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Area */}
//       <div className="flex-1 md:ml-64 flex flex-col">
//         {/* Topbar */}
//         <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
//           <button className="md:hidden" onClick={() => setOpen(true)}>
//             <Menu />
//           </button>

//           <h2 className="text-lg font-semibold">Admin Panel</h2>

//           <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-600">Admin</span>
//             <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
//               A
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import React from 'react'

const AdminDashboard = () => {
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard