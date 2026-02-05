import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Content from "./components/pages/Content";
import Login from "./components/AuthAdmin-Folder/Login";

import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./components/MenuPages/Dashboard";
import Properties from "./components/MenuPages/Properties";
import Tenants from "./components/MenuPages/Tenants";
import Units from "./components/MenuPages/Units";
import Payments from "./components/MenuPages/Payments";
// import Reports from "./components/MenuPages/Reports";
import Settings from "./components/MenuPages/Settings";
import AccountManagement from "./components/MenuPages/AccountManagement";
import Floor from "./components/MenuPages/Floor";
import TenantDetails from "./components/MenuPages/TenantDetails";
import ResetPassword from "./components/AuthAdmin-Folder/ForgotPasswordModal";
import Labor from "./components/MenuPages/Labor";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Content />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<Properties />} />
        <Route path="floors" element={<Floor />} />
        <Route path="units" element={<Units />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="tenants/:tenantId" element={<TenantDetails />} />
        <Route path="payments" element={<Payments />} />
        {/* <Route path="reports" element={<Reports />} /> */}
        <Route path="labor" element={<Labor />} />
        <Route path="settings" element={<Settings />} />
        <Route path="accounts-management" element={<AccountManagement />} />
        
      </Route>
    </Routes>
  );
}

export default App;
