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
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Building2,
  Home,
  Users,
  Wallet,
  AlertCircle,
  BarChart3,
  Globe,
} from "lucide-react";

const API = {
  properties: "http://localhost:5000/api/properties",
  units: "http://localhost:5000/api/units",
  tenants: "http://localhost:5000/api/tenants",
};

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

const countries = [
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Dubai",
  "Singapore",
  "Kuwait",
  "Saudi Arabia",
  "Qatar",
  "Bahrain",
  "Other",
];

export default function Dashboard() {
  /* Initialize country from localStorage or default to "" */
  const [country, setCountry] = useState(() => {
    return localStorage.getItem("dashboard_country") || "";
  });
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
    /* Save preference */
    if (country) {
      localStorage.setItem("dashboard_country", country);
    } else {
      localStorage.removeItem("dashboard_country");
    }
    loadDashboard();
  }, [country]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      /* 1. PROPERTIES */
      const propRes = await axios.get(API.properties, {
        params: country ? { country } : {},
      });
      const properties = propRes.data.data || [];
      const propertyIds = properties.map((p) => String(p._id));

      if (properties.length === 0) {
        clearDashboard();
        setLoading(false);
        return;
      }

      /* 2. UNITS (Parallel Fetch) */
      const unitPromises = propertyIds.map((id) =>
        axios.get(`${API.units}/property/${id}`).then((res) => res.data.data || [])
      );
      const unitsArrays = await Promise.all(unitPromises);
      const units = unitsArrays.flat();

      const occupied = units.filter((u) => u.availabilityStatus === "Occupied").length;
      const available = units.filter((u) => u.availabilityStatus === "Available").length;

      /* 3. TENANTS (Fetch All & Filter) */
      const tenantRes = await axios.get(API.tenants);
      const allTenants = tenantRes.data.data || [];
      const tenants = allTenants.filter((t) =>
        propertyIds.includes(String(t.propertyId))
      );

      /* 4. RENTS (Parallel Fetch) */
      let totalCollected = 0;
      let pendingAmount = 0;
      const monthlyRent = {};

      const rentPromises = tenants.map((t) =>
        axios.get(`${API.tenants}/${t._id}/rents`).then((res) => res.data.data || [])
      );
      const rentsArrays = await Promise.all(rentPromises);
      const rents = rentsArrays.flat();

      rents.forEach((r) => {
        monthlyRent[r.month] = (monthlyRent[r.month] || 0) + r.totalAmount;

        if (r.paymentStatus === "Paid") {
          totalCollected += r.totalAmount;
        } else {
          pendingAmount += r.totalAmount;
        }
      });

      /* UPDATE STATE */
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
        Object.entries(monthlyRent)
          .sort()
          .map(([month, amount]) => ({
            month,
            amount,
          }))
      );

      setUnitChart([
        { name: "Occupied", value: occupied },
        { name: "Available", value: available },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50/50 min-h-screen space-y-8 max-w-[1600px] mx-auto">
      {/* HEADER section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" /> Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time insights on your property portfolio
          </p>
        </div>

        <div className="relative group w-full md:w-auto">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={18} />
          <select
            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:border-indigo-300 transition-all w-full md:w-64 font-medium"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Global View (All Countries)</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100"></div>
          ))}
        </div>
      ) : (
        <>
          {/* KPIS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPI
              title="Total Properties"
              value={stats.properties}
              icon={<Building2 size={24} />}
              color="bg-blue-50 text-blue-600"
            />
            <KPI
              title="Total Units"
              value={stats.units}
              sub={`${stats.available} Available`}
              icon={<Home size={24} />}
              color="bg-emerald-50 text-emerald-600"
            />
            <KPI
              title="Active Tenants"
              value={stats.tenants}
              icon={<Users size={24} />}
              color="bg-violet-50 text-violet-600"
            />
            <KPI
              title="Revenue Collected"
              value={formatCurrency(stats.totalCollected)}
              // sub={`Pending: ${formatCurrency(stats.pendingAmount)}`}
              icon={<Wallet size={24} />}
              color="bg-amber-50 text-amber-600"
              isCurrency
            />
            <KPI
              title="Pending Dues"
              value={formatCurrency(stats.pendingAmount)}
              icon={<AlertCircle size={24} />}
              color="bg-red-50 text-red-600"
              isCurrency
            />
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartBox title="Monthly Revenue Trend" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rentChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox title="Occupancy Rate">
              <div className="relative h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={unitChart}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {unitChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Stats */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.units ? Math.round((stats.occupied / stats.units) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Occupied</p>
                </div>
              </div>
            </ChartBox>
          </div>
        </>
      )}
    </div>
  );
}

const KPI = ({ title, value, icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow group">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {sub && <p className="text-xs font-medium text-gray-400 mt-2">{sub}</p>}
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
      {icon}
    </div>
  </div>
);

const ChartBox = ({ title, children, className }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
    </div>
    {children}
  </div>
);
