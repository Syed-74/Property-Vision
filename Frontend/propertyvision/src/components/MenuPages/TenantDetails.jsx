import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Pencil,
  Trash2,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  CreditCard
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API = {
  tenants: `${API_BASE}/api/tenants`,
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
  const [downloading, setDownloading] = useState(null);

  const [editingRent, setEditingRent] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const tenantRes = await axios.get(`${API.tenants}/${tenantId}`);
      setTenant(tenantRes.data.data);

      const rentRes = await axios.get(`${API.tenants}/${tenantId}/rents`);
      setRents(rentRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  /* ================= ADD MONTH ================= */
  const saveMonth = async () => {
    if (!rentForm.month) return;

    try {
      setLoading(true);

      const payload = {
        ...rentForm,
        rentAmount: Number(String(rentForm.rentAmount).replace(/[^\d]/g, "")),
        maintenanceAmount: Number(
          String(rentForm.maintenanceAmount).replace(/[^\d]/g, ""),
        ),
      };

      await axios.post(`${API.tenants}/${tenantId}/rents`, payload);

      setRentForm(initialRent);
      loadData();
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE RENT ================= */
  const updateRent = async () => {
    try {
      await axios.put(`${API.tenants}/rents/${editingRent._id}`, editingRent);
      setEditingRent(null);
      loadData();
    } catch (err) {
      alert("Failed to update rent");
    }
  };

  /* ================= DELETE RENT ================= */
  const deleteRent = async (id) => {
    if (!window.confirm("Delete this rent record?")) return;
    try {
      await axios.delete(`${API.tenants}/rents/${id}`);
      loadData();
    } catch (err) {
      alert("Failed to delete rent");
    }
  };

  /* ================= DOWNLOAD RECEIPT ================= */
  const downloadReceipt = async (rentId, month) => {
    try {
      setDownloading(rentId);
      const response = await axios.get(`${API.tenants}/rents/${rentId}/receipt`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Could not download receipt. Ensure payment is 'Paid'.");
    } finally {
      setDownloading(null);
    }
  };

  const getFileUrl = (path) => {
    if (!path) return "";
    return `${API_BASE}/${path.replace(/\\/g, "/")}`;
  };

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
        Loading tenant details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50/50 min-h-screen space-y-8 max-w-7xl mx-auto">

      {/* ================= HEADER & INFO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Details Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="text-white/80" />
              Tenant & Flat Details
            </h2>
            <p className="opacity-80 text-sm mt-1">Tenant ID: {tenant.tenantCode}</p>
          </div>

          <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Name</label>
              <p className="font-medium text-gray-900 text-lg">{tenant.fullName}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</label>
              <p className="text-gray-700">{tenant.phone || "—"}</p>
              <p className="text-gray-500 text-xs">{tenant.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {tenant.status}
              </span>
            </div>

            <div className="col-span-2 lg:col-span-3 border-t pt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-500 block text-xs">Property</span>
                <span className="font-semibold">{tenant.propertyId?.propertyName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Unit/Flat</span>
                <span className="font-semibold text-indigo-600">{tenant.unitId?.unitNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Base Rent</span>
                <span className="font-semibold">₹{tenant.rentAmount}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Maintenance</span>
                <span className="font-semibold">₹{tenant.maintenanceAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="p-4 border-b bg-gray-50 rounded-t-2xl">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={18} /> Documents
            </h3>
          </div>
          <div className="p-4 flex flex-col gap-3 flex-1 overflow-auto">
            {!tenant.aadhaarCard && !tenant.panCard && !tenant.bondPaper && (
              <p className="text-gray-400 text-sm italic p-4 text-center">No documents uploaded.</p>
            )}
            {tenant.aadhaarCard && (
              <a href={getFileUrl(tenant.aadhaarCard)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                <div className="bg-orange-100 p-2 rounded text-orange-600 group-hover:bg-orange-200">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Aadhaar Card</p>
                  <p className="text-xs text-gray-500 truncate">View Document</p>
                </div>
              </a>
            )}
            {tenant.panCard && (
              <a href={getFileUrl(tenant.panCard)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded text-blue-600 group-hover:bg-blue-200">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">PAN Card</p>
                  <p className="text-xs text-gray-500 truncate">View Document</p>
                </div>
              </a>
            )}
            {tenant.bondPaper && (
              <a href={getFileUrl(tenant.bondPaper)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                <div className="bg-green-100 p-2 rounded text-green-600 group-hover:bg-green-200">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Bond/Agreement</p>
                  <p className="text-xs text-gray-500 truncate">View Document</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ================= ADD MONTH ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <CreditCard className="text-indigo-600" />
          Record Monthly Payment
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Month</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={rentForm.month}
              onChange={(e) => setRentForm({ ...rentForm, month: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Rent Amount</label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={rentForm.rentAmount}
              onChange={(e) => setRentForm({ ...rentForm, rentAmount: e.target.value })}
            >
              <option value="">Select Rent</option>
              {tenant?.rentAmount && <option value={tenant.rentAmount}>₹{tenant.rentAmount}</option>}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Maintenance</label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={rentForm.maintenanceAmount}
              onChange={(e) => setRentForm({ ...rentForm, maintenanceAmount: e.target.value })}
            >
              <option value="">Select Maintenance</option>
              {tenant?.maintenanceAmount && <option value={tenant.maintenanceAmount}>₹{tenant.maintenanceAmount}</option>}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Status</label>
            <select
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={rentForm.paymentStatus}
              onChange={(e) => setRentForm({ ...rentForm, paymentStatus: e.target.value })}
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Late</option>
            </select>
          </div>

          <div>
            <button
              onClick={saveMonth}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
            >
              {loading ? "Saving..." : "Record Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RENT HISTORY ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Month</th>
                <th className="px-6 py-3 text-left font-medium">Rent</th>
                <th className="px-6 py-3 text-left font-medium">Maint.</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Paid On</th>
                <th className="px-6 py-3 text-left font-medium">Receipt</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="mb-2 opacity-50" size={32} />
                      No payment records found
                    </div>
                  </td>
                </tr>
              ) : (
                rents.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.month}</td>
                    <td className="px-6 py-4">₹{r.rentAmount}</td>
                    <td className="px-6 py-4">₹{r.maintenanceAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${r.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                          r.paymentStatus === 'Late' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {r.paidOn ? new Date(r.paidOn).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {r.paymentStatus === 'Paid' && (
                        <button
                          onClick={() => downloadReceipt(r._id, r.month)}
                          disabled={downloading === r._id}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-medium hover:underline disabled:opacity-50"
                        >
                          {downloading === r._id ? (
                            <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : <Download size={14} />}
                          Receipt
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setEditingRent({ ...r })}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteRent(r._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT RENT MODAL ================= */}
      {editingRent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 transform transition-all scale-100">
            <h3 className="font-bold text-xl text-gray-800">Edit Payment Record</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={editingRent.rentAmount}
                  onChange={(e) => setEditingRent({ ...editingRent, rentAmount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Amount</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={editingRent.maintenanceAmount}
                  onChange={(e) => setEditingRent({ ...editingRent, maintenanceAmount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={editingRent.paymentStatus}
                  onChange={(e) => setEditingRent({ ...editingRent, paymentStatus: e.target.value })}
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Late</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid On</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={editingRent.paidOn ? new Date(editingRent.paidOn).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingRent({ ...editingRent, paidOn: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingRent(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={updateRent}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium shadow-md"
              >
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
