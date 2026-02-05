import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const API = {
  properties: "http://localhost:5000/api/properties",
  units: "http://localhost:5000/api/units",
  tenants: "http://localhost:5000/api/tenants",
};

const COLORS = ["#4f46e5", "#22c55e"];

const countries = [
  "India","USA","UK","Canada","Australia",
  "Dubai","Singapore","Kuwait",
  "Saudi Arabia","Qatar","Bahrain","Other"
];

export default function Dashboard() {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

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
  }, [country]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      /* PROPERTIES BY COUNTRY */
      const propRes = await axios.get(API.properties, {
        params: country ? { country } : {},
      });

      const properties = propRes.data.data || [];
      const propertyIds = properties.map(p => String(p._id));

      if (!propertyIds.length) {
        clearDashboard();
        setLoading(false);
        return;
      }

      /* UNITS */
      let units = [];
      for (const id of propertyIds) {
        const res = await axios.get(`${API.units}/property/${id}`);
        units.push(...(res.data.data || []));
      }

      const occupied = units.filter(u => u.availabilityStatus === "Occupied").length;
      const available = units.filter(u => u.availabilityStatus === "Available").length;

      /* TENANTS */
      const tenantRes = await axios.get(API.tenants);
      const tenants = tenantRes.data.data.filter(t =>
        propertyIds.includes(String(t.propertyId))
      );

      /* RENT */
      let totalCollected = 0;
      let pendingAmount = 0;
      const monthlyRent = {};

      for (const t of tenants) {
        const rentRes = await axios.get(`${API.tenants}/${t._id}/rents`);
        rentRes.data.data.forEach(r => {
          monthlyRent[r.month] =
            (monthlyRent[r.month] || 0) + r.totalAmount;

          r.paymentStatus === "Paid"
            ? totalCollected += r.totalAmount
            : pendingAmount += r.totalAmount;
        });
      }

      setStats({
        properties: properties.length,
        units: units.length,
        occupied,
        available,
        tenants: tenants.length,
        totalCollected,
        pendingAmount,
      });

      setRentChart(
        Object.entries(monthlyRent).map(([month, amount]) => ({
          month, amount
        }))
      );

      setUnitChart([
        { name: "Occupied", value: occupied },
        { name: "Available", value: available }
      ]);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const clearDashboard = () => {
    setStats({
      properties: 0,
      units: 0,
      occupied: 0,
      available: 0,
      tenants: 0,
      totalCollected: 0,
      pendingAmount: 0,
    });
    setRentChart([]);
    setUnitChart([]);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

      {/* COUNTRY FILTER */}
      <div className="flex justify-end">
        <select
          className="border rounded-lg px-3 py-2 w-full sm:w-64"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <KPI label="Properties" value={stats.properties} />
        <KPI label="Units" value={stats.units} />
        <KPI label="Occupied" value={stats.occupied} />
        <KPI label="Available" value={stats.available} />
        <KPI label="Tenants" value={stats.tenants} />
        <KPI label="Collected" value={`₹${stats.totalCollected}`} />
        <KPI label="Pending" value={`₹${stats.pendingAmount}`} />
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading dashboard…</p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartBox title="Monthly Rent">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rentChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Occupancy">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={unitChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  label
                >
                  {unitChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

        </div>
      )}
    </div>
  );
}

const KPI = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-3 text-center">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);
