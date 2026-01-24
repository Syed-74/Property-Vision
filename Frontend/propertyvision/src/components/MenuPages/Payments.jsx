import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import api from "../../api/axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  /* ================= FETCH PAYMENTS ================= */
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/api/payments");

        // ✅ SAFE RESPONSE HANDLING (VERY IMPORTANT)
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
      .reduce((sum, p) => sum + Number(p.totalAmount || 0), 0);

  const totalCollected = sumByStatus("Paid");
  const totalPending = sumByStatus("Pending");
  const totalLate = sumByStatus("Late");

  const filteredPayments =
    filter === "All"
      ? payments
      : payments.filter((p) => p.paymentStatus === filter);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading payments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Payments
        </h1>
        <p className="text-sm text-gray-500">
          Track rent & maintenance payments
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Collected"
          amount={totalCollected}
          icon={<CheckCircle className="text-green-600" />}
          bg="bg-green-50"
        />
        <SummaryCard
          title="Pending"
          amount={totalPending}
          icon={<Clock className="text-yellow-600" />}
          bg="bg-yellow-50"
        />
        <SummaryCard
          title="Late"
          amount={totalLate}
          icon={<AlertTriangle className="text-red-600" />}
          bg="bg-red-50"
        />
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex flex-wrap gap-2">
        {["All", "Paid", "Pending", "Late"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition
              ${
                filter === status
                  ? "bg-[#9c4a1a] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Tenant</Th>
              <Th>Property / Unit</Th>
              <Th>Month</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Paid On</Th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No payment records found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <Td>{p.tenantName || "—"}</Td>
                  <Td>
                    {p.propertyName || "—"} / {p.unitNumber || "—"}
                  </Td>
                  <Td>{p.month || "—"}</Td>
                  <Td className="font-semibold">
                    ₹{Number(p.totalAmount || 0)}
                  </Td>
                  <Td>
                    <StatusBadge status={p.paymentStatus} />
                  </Td>
                  <Td>
                    {p.paidOn
                      ? new Date(p.paidOn).toLocaleDateString()
                      : "—"}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const SummaryCard = ({ title, amount, icon, bg }) => (
  <div className={`rounded-xl p-4 flex items-center gap-4 ${bg}`}>
    <div className="p-3 bg-white rounded-full shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold">₹{amount}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Late: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

const Th = ({ children }) => (
  <th className="p-3 text-left font-medium text-gray-600">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 ${className}`}>{children}</td>
);

export default Payments;
