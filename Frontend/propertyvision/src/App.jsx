import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Content from "../../propertyvision/src/components/pages/Content";
import Login from "../../propertyvision/src/components/AuthAdmin-Folder/Login";

import AdminLayout from "../src/components/layout/AdminLayout";
import Dashboard from "./components/MenuPages/Dashboard";
import Properties from "./components/MenuPages/Properties";
import Tenants from "./components/MenuPages/Tenants";
import Units from "./components/MenuPages/Units";
import Payments from "./components/MenuPages/Payments";
import Reports from "./components/MenuPages/Reports";
import Settings from "./components/MenuPages/Settings";
import AccountManagement from "./components/MenuPages/AccountManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts-management" element={<AccountManagement />} />
          <Route path="properties" element={<Properties />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="units" element={<Units />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
