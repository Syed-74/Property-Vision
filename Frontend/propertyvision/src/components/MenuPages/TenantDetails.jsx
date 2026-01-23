import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = {
  tenants: "http://localhost:5000/api/tenants",
};

const initialRent = {
  month: "",
  rentAmount: "",
  maintenanceAmount: "",
  paymentStatus: "Pending",
  paidOn: "",
};

export default function TenantDetails() {
  const { tenantId } = useParams();

  const [tenant, setTenant] = useState(null);
  const [rents, setRents] = useState([]);
  const [rentForm, setRentForm] = useState(initialRent);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD TENANT & HISTORY ================= */
  const loadData = async () => {
    try {
      const tenantRes = await axios.get(`${API.tenants}/${tenantId}`);
      setTenant(tenantRes.data.data);

      const rentRes = await axios.get(
        `${API.tenants}/${tenantId}/rents`
      );
      setRents(rentRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  /* ================= SAVE MONTH ================= */
  const saveMonth = async () => {
    if (!rentForm.month) return;

    try {
      setLoading(true);
      await axios.post(
        `${API.tenants}/${tenantId}/rents`,
        rentForm
      );
      setRentForm(initialRent);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  if (!tenant) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading tenant details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ================= TENANT SUMMARY ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Tenant & Flat Details
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <p><b>Tenant:</b> {tenant.fullName}</p>
          <p><b>Phone:</b> {tenant.phone || "—"}</p>
          <p><b>Property:</b> {tenant.propertyId?.propertyName}</p>
          <p><b>Floor:</b> {tenant.floorId?.floorName || `Floor ${tenant.floorId?.floorNumber}`}</p>
          <p><b>Flat:</b> {tenant.unitId?.unitNumber}</p>
          <p><b>Base Rent:</b> ₹{tenant.rentAmount}</p>
          <p><b>Maintenance:</b> ₹{tenant.maintenanceAmount}</p>
          <p>
            <b>Status:</b>{" "}
            <span className="text-green-600 font-medium">
              {tenant.status}
            </span>
          </p>
        </div>
      </div>

      {/* ================= ADD MONTHLY RENT ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Add Monthly Rent
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="month"
            className="input"
            value={rentForm.month}
            onChange={e =>
              setRentForm({ ...rentForm, month: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Rent Amount"
            value={rentForm.rentAmount}
            onChange={e =>
              setRentForm({ ...rentForm, rentAmount: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Maintenance Amount"
            value={rentForm.maintenanceAmount}
            onChange={e =>
              setRentForm({
                ...rentForm,
                maintenanceAmount: e.target.value,
              })
            }
          />

          <select
            className="input"
            value={rentForm.paymentStatus}
            onChange={e =>
              setRentForm({
                ...rentForm,
                paymentStatus: e.target.value,
              })
            }
          >
            <option>Pending</option>
            <option>Paid</option>
            <option>Late</option>
          </select>
        </div>

        <div className="mt-4">
          <button
            onClick={saveMonth}
            disabled={loading}
            className="bg-[#9c4a1a] hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Save Month
          </button>
        </div>
      </div>

      {/* ================= RENT HISTORY ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Rent History
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">Rent</th>
                <th className="p-2 border">Maintenance</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Paid On</th>
              </tr>
            </thead>
            <tbody>
              {rents.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No rent records found
                  </td>
                </tr>
              ) : (
                rents.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{r.month}</td>
                    <td className="p-2 border">₹{r.rentAmount}</td>
                    <td className="p-2 border">₹{r.maintenanceAmount}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs
                        ${
                          r.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : r.paymentStatus === "Late"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {r.paidOn
                        ? new Date(r.paidOn).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
