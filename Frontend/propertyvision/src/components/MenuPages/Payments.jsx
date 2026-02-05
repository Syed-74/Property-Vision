import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, AlertTriangle, Search, Calendar, Filter, Download, ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { format } from "date-fns";

/* ================= API CONFIG (LOCAL ONLY) ================= */

const BASE_URL = "http://localhost:5000/api/payments";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  /* ================= FETCH PAYMENTS ================= */
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          BASE_URL,
          getAuthHeaders()
        );

        // ✅ SAFE RESPONSE HANDLING
        const list =
          res.data?.data ||
          res.data?.payments ||
          res.data ||
          [];

        setPayments(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(
          "Payments API error:",
          err.response?.status,
          err.response?.data
        );
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  /* ================= SUMMARY ================= */
  const sumByStatus = (status) =>
    payments
      .filter((p) => p.paymentStatus === status)
      .reduce(
        (sum, p) => sum + Number(p.totalAmount || 0),
        0
      );

  const totalCollected = sumByStatus("Paid");
  const totalPending = sumByStatus("Pending");
  const totalLate = sumByStatus("Late");
  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.totalAmount || 0), 0);

  /* ================= FILTERING LOGIC ================= */
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filter === "All" || p.paymentStatus === filter;
    const matchesSearch =
      (p.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.unitNumber?.toString().includes(searchTerm));

    // Date Range Filtering (based on paidOn or month)
    let matchesDate = true;
    if (dateRange.start && p.paidOn) {
      matchesDate = new Date(p.paidOn) >= new Date(dateRange.start);
    }
    if (dateRange.end && p.paidOn && matchesDate) {
      matchesDate = new Date(p.paidOn) <= new Date(dateRange.end);
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 bg-gray-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        Loading payments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="text-indigo-600" /> Payments & Transactions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage all rent and maintenance transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
            <DollarSign size={16} /> Record Payment
          </button>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <SummaryCard
          title="Total Revenue"
          amount={totalRevenue}
          icon={<DollarSign className="text-indigo-600" />}
          bg="bg-indigo-50"
          trend="+12% this month"
          isCurrency
          formatCurrency={formatCurrency}
        />
        <SummaryCard
          title="Collected"
          amount={totalCollected}
          icon={<CheckCircle className="text-emerald-600" />}
          bg="bg-emerald-50"
          isCurrency
          formatCurrency={formatCurrency}
        />
        <SummaryCard
          title="Pending"
          amount={totalPending}
          icon={<Clock className="text-amber-600" />}
          bg="bg-amber-50"
          isCurrency
          formatCurrency={formatCurrency}
        />
        <SummaryCard
          title="Late / Overdue"
          amount={totalLate}
          icon={<AlertTriangle className="text-red-600" />}
          bg="bg-red-50"
          isCurrency
          formatCurrency={formatCurrency}
        />
      </div>

      {/* ================= FILTERS & CONTROLS ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">

        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {["All", "Paid", "Pending", "Late"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                    ${filter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tenant, unit..."
              className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
            <Calendar size={16} className="text-gray-400" />
            <input
              type="date"
              className="bg-transparent border-none text-sm text-gray-600 focus:ring-0 p-0"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="bg-transparent border-none text-sm text-gray-600 focus:ring-0 p-0"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <Th>Tenant Name</Th>
                <Th>Property Details</Th>
                <Th>Billing Month</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Payment Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Filter className="text-gray-300" size={24} />
                      </div>
                      <p className="font-medium text-gray-900">No transactions found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                    <Td>
                      <div className="font-semibold text-gray-900">{p.tenantName || "—"}</div>
                      <div className="text-xs text-gray-500">ID: {p._id.substring(0, 6)}</div>
                    </Td>
                    <Td>
                      <div className="text-gray-900">{p.propertyName || "Unknown Property"}</div>
                      <div className="text-xs text-gray-500">Unit {p.unitNumber || "—"}</div>
                    </Td>
                    <Td>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                        {p.month || "—"}
                      </div>
                    </Td>
                    <Td>
                      <span className="font-bold text-gray-900">{formatCurrency(p.totalAmount || 0)}</span>
                    </Td>
                    <Td>
                      <StatusBadge status={p.paymentStatus} />
                    </Td>
                    <Td className="text-gray-500">
                      {p.paidOn ? format(new Date(p.paidOn), "MMM dd, yyyy") : "—"}
                    </Td>
                    <Td>
                      <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Static for now) */}
        {filteredPayments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <p>Showing {filteredPayments.length} transactions</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 rounded-lg hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const SummaryCard = ({ title, amount, icon, bg, trend, isCurrency, formatCurrency }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-gray-900">
        {isCurrency ? formatCurrency(amount) : amount}
      </h3>
      {trend && (
        <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
          <ArrowUpRight size={12} /> {trend}
        </p>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Late: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] ||
        "bg-gray-50 text-gray-600 border-gray-200"
        }`}
    >
      {status || "Unknown"}
    </span>
  );
};

const Th = ({ children }) => (
  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-4 ${className}`}>
    {children}
  </td>
);

export default Payments;
