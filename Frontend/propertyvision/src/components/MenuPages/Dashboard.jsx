import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API = {
  properties: "http://localhost:5000/api/properties",
  units: "http://localhost:5000/api/units",
  tenants: "http://localhost:5000/api/tenants",
};

const COLORS = ["#4f46e5", "#22c55e", "#f97316"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    units: 0,
    occupied: 0,
    available: 0,
    tenants: 0,
    totalCollected: 0,
    pendingAmount: 0,
  });

  const [rentChart, setRentChart] = useState([]);
  const [unitChart, setUnitChart] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const propertyRes = await axios.get(API.properties);
      const tenantRes = await axios.get(API.tenants);

      const properties = propertyRes.data.data || [];
      const tenants = tenantRes.data.data || [];

      let allUnits = [];
      let totalCollected = 0;
      let pendingAmount = 0;
      const monthlyRent = {};

      // Load units property-wise
      for (const p of properties) {
        const unitRes = await axios.get(
          `${API.units}/property/${p._id}`
        );
        allUnits = [...allUnits, ...(unitRes.data.data || [])];
      }

      // Rent calculation
      for (const t of tenants) {
        const rentRes = await axios.get(
          `${API.tenants}/${t._id}/rents`
        );

        rentRes.data.data.forEach(r => {
          const month = r.month;
          monthlyRent[month] =
            (monthlyRent[month] || 0) + r.totalAmount;

          if (r.paymentStatus === "Paid") {
            totalCollected += r.totalAmount;
          } else {
            pendingAmount += r.totalAmount;
          }
        });
      }

      setStats({
        properties: properties.length,
        units: allUnits.length,
        occupied: allUnits.filter(u => u.availabilityStatus === "Occupied").length,
        available: allUnits.filter(u => u.availabilityStatus === "Available").length,
        tenants: tenants.length,
        totalCollected,
        pendingAmount,
      });

      setRentChart(
        Object.keys(monthlyRent).map(m => ({
          month: m,
          amount: monthlyRent[m],
        }))
      );

      setUnitChart([
        { name: "Occupied", value: allUnits.filter(u => u.availabilityStatus === "Occupied").length },
        { name: "Available", value: allUnits.filter(u => u.availabilityStatus === "Available").length },
      ]);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard title="Properties" value={stats.properties} />
        <StatCard title="Units" value={stats.units} />
        <StatCard title="Occupied" value={stats.occupied} />
        <StatCard title="Available" value={stats.available} />
        <StatCard title="Tenants" value={stats.tenants} />
        <StatCard title="Collected" value={`₹${stats.totalCollected}`} />
        <StatCard title="Pending" value={`₹${stats.pendingAmount}`} />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Rent */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Monthly Rent Collection</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rentChart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Unit Status */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">Unit Occupancy</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={unitChart}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {unitChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);

export default Dashboard;
