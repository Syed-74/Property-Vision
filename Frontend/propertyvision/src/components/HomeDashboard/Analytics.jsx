import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ------------------ DATA ------------------ */

const revenueData = [
  { month: "Jan", revenue: 680, expenses: 320, net: 360 },
  { month: "Feb", revenue: 720, expenses: 340, net: 380 },
  { month: "Mar", revenue: 760, expenses: 350, net: 410 },
  { month: "Apr", revenue: 800, expenses: 370, net: 430 },
  { month: "May", revenue: 840, expenses: 380, net: 460 },
  { month: "Jun", revenue: 870, expenses: 360, net: 510 },
  { month: "Jul", revenue: 900, expenses: 390, net: 510 },
  { month: "Aug", revenue: 920, expenses: 400, net: 520 },
  { month: "Sep", revenue: 910, expenses: 380, net: 530 },
  { month: "Oct", revenue: 940, expenses: 410, net: 530 },
  { month: "Nov", revenue: 970, expenses: 420, net: 550 },
  { month: "Dec", revenue: 1000, expenses: 440, net: 560 },
];

const occupancyData = [
  { name: "Residential", value: 45 },
  { name: "Commercial", value: 25 },
  { name: "Mixed-Use", value: 20 },
  { name: "Industrial", value: 10 },
];

const COLORS = ["#6b705c", "#a05a2c", "#c97c5d", "#6c757d"];

/* ------------------ COMPONENT ------------------ */

const Analytics = () => {
  return (
    <section id="dashboard" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">

        {/* HEADER */}
        <div className="text-center px-2">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Portfolio <span className="text-blue-600">Dashboard</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time insights and analytics for your real estate portfolio
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard title="Total Properties" value="24" growth="+12.5%" bg="bg-slate-100" />
          <MetricCard title="Occupancy Rate" value="94.7%" growth="+8.2%" bg="bg-blue-100" />
          <MetricCard title="Monthly Revenue" value="$847K" growth="+15.3%" bg="bg-green-100" />
          <MetricCard title="Net Operating Income" value="$521K" growth="+22.1%" bg="bg-orange-100" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Revenue Trends */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border">
            <h4 className="text-base sm:text-lg font-semibold mb-3">
              Revenue Trends
            </h4>
            <div className="h-72 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line dataKey="revenue" stroke="#6b705c" strokeWidth={2} />
                  <Line dataKey="expenses" stroke="#a05a2c" strokeWidth={2} />
                  <Line dataKey="net" stroke="#495057" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Analysis */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border">
            <h4 className="text-base sm:text-lg font-semibold mb-3">
              Occupancy Analysis
            </h4>
            <div className="h-72 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {occupancyData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------ SUB COMPONENTS ------------------ */

const MetricCard = ({ title, value, growth, bg }) => (
  <div className="p-5 sm:p-6 rounded-xl border bg-white hover:shadow transition">
    <div className="flex justify-between items-center mb-3">
      <div className={`p-3 rounded-lg ${bg}`} />
      <span className="text-xs sm:text-sm text-green-600 font-medium">
        {growth}
      </span>
    </div>
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const QuickAction = ({ title, description }) => (
  <button className="bg-white p-5 sm:p-6 rounded-xl border text-left hover:shadow transition">
    <p className="font-medium text-gray-900 mb-1">{title}</p>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);

export default Analytics;
