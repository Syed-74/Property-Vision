// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// /* ================= API ================= */
// const API = {
//   tenants: "http://localhost:5000/api/tenants",
//   properties: "http://localhost:5000/api/properties",
//   floors: "http://localhost:5000/api/floors",
//   units: "http://localhost:5000/api/units",
// };

// /* ================= HELPERS ================= */
// const generateTenantCode = () =>
//   "TEN-" + Math.random().toString(36).substring(2, 7).toUpperCase();

// const getInitialTenant = () => ({
//   tenantCode: generateTenantCode(),
//   fullName: "",
//   phone: "",
//   propertyId: "",
//   floorId: "",
//   unitId: "",
//   rentAmount: "",
//   maintenanceAmount: "",
//   leaseStartDate: "",
//   aadhaarCard: null,
//   panCard: null,
//   bondPaper: null,
// });

// /* ================= COMPONENT ================= */
// export default function Tenants() {
//   const navigate = useNavigate();

//   const [tenants, setTenants] = useState([]);
//   const [properties, setProperties] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [units, setUnits] = useState([]);

//   const [tenantForm, setTenantForm] = useState(getInitialTenant());
//   const [openTenant, setOpenTenant] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingTenantId, setEditingTenantId] = useState(null);

//   /* ================= LOAD DATA ================= */
//   const loadTenants = async () => {
//     const res = await axios.get(API.tenants);
//     setTenants(res.data.data || []);
//   };

//   useEffect(() => {
//     loadTenants();
//     axios.get(API.properties).then((r) => setProperties(r.data.data || []));
//   }, []);

//   useEffect(() => {
//     if (!tenantForm.propertyId) return;
//     axios
//       .get(`${API.floors}/property/${tenantForm.propertyId}`)
//       .then((r) => setFloors(r.data.data || []));
//   }, [tenantForm.propertyId]);

//   useEffect(() => {
//     if (!tenantForm.floorId) return;
//     axios.get(`${API.units}/property/${tenantForm.propertyId}`).then((r) => {
//       setUnits(
//         (r.data.data || []).filter(
//           (u) =>
//             u.floorId?._id === tenantForm.floorId &&
//             u.availabilityStatus === "Available",
//         ),
//       );
//     });
//   }, [tenantForm.floorId]);

//   /* ================= ACTIONS ================= */
//   const saveTenant = async () => {
//     if (
//       !tenantForm.fullName ||
//       !tenantForm.propertyId ||
//       !tenantForm.floorId ||
//       !tenantForm.unitId ||
//       !tenantForm.rentAmount ||
//       !tenantForm.leaseStartDate
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         ...tenantForm,
//         rentAmount: Number(tenantForm.rentAmount),
//         maintenanceAmount: Number(tenantForm.maintenanceAmount || 0),
//       };

//       if (isEditMode) {
//         await axios.put(`${API.tenants}/${editingTenantId}`, payload);
//       } else {
//         await axios.post(API.tenants, payload);
//       }

//       setOpenTenant(false);
//       setTenantForm(getInitialTenant());
//       setIsEditMode(false);
//       setEditingTenantId(null);
//       loadTenants();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to save tenant");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const editTenant = (tenant) => {
//     setTenantForm({
//       tenantCode: tenant.tenantCode,
//       fullName: tenant.fullName,
//       phone: tenant.phone,
//       propertyId: tenant.propertyId?._id || "",
//       floorId: tenant.floorId?._id || "",
//       unitId: tenant.unitId?._id || "",
//       rentAmount: tenant.rentAmount,
//       maintenanceAmount: tenant.maintenanceAmount,
//       leaseStartDate: tenant.leaseStartDate?.slice(0, 10),
//     });

//     setEditingTenantId(tenant._id);
//     setIsEditMode(true);
//     setOpenTenant(true);
//   };

//   const deleteTenant = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this tenant?")) return;
//     await axios.delete(`${API.tenants}/${id}`);
//     loadTenants();
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//       <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold">Tenant Management</h1>
//           <p className="text-sm text-gray-500">
//             Property-wise tenant, rent & maintenance tracking
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setTenantForm(getInitialTenant());
//             setIsEditMode(false);
//             setOpenTenant(true);
//           }}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
//         >
//           + Add Tenant
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//         {tenants.map((t) => (
//           <div
//             key={t._id}
//             className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition p-5 flex flex-col justify-between"
//           >
//             <div className="space-y-3">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-semibold">{t.fullName}</h3>
//                   <p className="text-xs text-gray-500">
//                     Tenant Code: {t.tenantCode}
//                   </p>
//                 </div>

//                 <span
//                   className={`px-3 py-1 rounded-full text-xs ${
//                     t.status === "Active"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {t.status}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600">
//                 Flat {t.unitId?.unitNumber} • {t.propertyId?.propertyName}
//               </p>

//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Rent</p>
//                   <p className="font-semibold">₹{t.rentAmount}</p>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Maintenance</p>
//                   <p className="font-semibold">₹{t.maintenanceAmount}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
//               <button
//                 onClick={() => navigate(`/admin/dashboard/tenants/${t._id}`)}
//                 className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg py-2 transition"
//               >
//                 Manage
//               </button>
//               <button
//                 onClick={() => editTenant(t)}
//                 className="bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white rounded-lg py-2 transition"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => deleteTenant(t._id)}
//                 className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-lg py-2 transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {openTenant && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="px-6 py-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-semibold">
//                 {isEditMode ? "Edit Tenant" : "Add Tenant"}
//               </h2>
//               <button
//                 onClick={() => setOpenTenant(false)}
//                 className="text-2xl leading-none hover:text-red-500"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Form */}
//             <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <label className="label">Tenant Code</label>
//                 <input
//                   className="input bg-gray-100 cursor-not-allowed"
//                   value={tenantForm.tenantCode}
//                   disabled
//                 />
//               </div>

//               <div>
//                 <label className="label">Full Name</label>
//                 <input
//                   className="input"
//                   placeholder="Enter tenant full name"
//                   value={tenantForm.fullName}
//                   onChange={(e) =>
//                     setTenantForm({ ...tenantForm, fullName: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="label">Phone Number</label>
//                 <input
//                   className="input"
//                   placeholder="Enter phone number"
//                   value={tenantForm.phone}
//                   onChange={(e) =>
//                     setTenantForm({ ...tenantForm, phone: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="label">Lease Start Date</label>
//                 <input
//                   type="date"
//                   className="input"
//                   value={tenantForm.leaseStartDate}
//                   onChange={(e) =>
//                     setTenantForm({
//                       ...tenantForm,
//                       leaseStartDate: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="label">Monthly Rent</label>
//                 <input
//                   className="input"
//                   placeholder="Enter rent amount"
//                   value={tenantForm.rentAmount}
//                   onChange={(e) =>
//                     setTenantForm({ ...tenantForm, rentAmount: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="label">Maintenance Charges</label>
//                 <input
//                   className="input"
//                   placeholder="Enter maintenance amount"
//                   value={tenantForm.maintenanceAmount}
//                   onChange={(e) =>
//                     setTenantForm({
//                       ...tenantForm,
//                       maintenanceAmount: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Attachments */}
//               {/* Attachments */}
//               <div className="sm:col-span-2">
//                 <p className="font-medium mb-1">Attachments</p>
//                 <p className="text-xs text-gray-500 mb-3">
//                   All attachment fields are optional
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div>
//                     <label className="label">
//                       Aadhaar Card{" "}
//                       <span className="text-gray-400">(Optional)</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="input"
//                       onChange={(e) =>
//                         setTenantForm({
//                           ...tenantForm,
//                           aadhaarCard: e.target.files[0],
//                         })
//                       }
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       PAN Card <span className="text-gray-400">(Optional)</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="input"
//                       onChange={(e) =>
//                         setTenantForm({
//                           ...tenantForm,
//                           panCard: e.target.files[0],
//                         })
//                       }
//                     />
//                   </div>

//                   <div>
//                     <label className="label">
//                       Bond Agreement{" "}
//                       <span className="text-gray-400">(Optional)</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="input"
//                       onChange={(e) =>
//                         setTenantForm({
//                           ...tenantForm,
//                           bondPaper: e.target.files[0],
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Property</label>
//                 <select
//                   className="input"
//                   value={tenantForm.propertyId}
//                   onChange={(e) =>
//                     setTenantForm({ ...tenantForm, propertyId: e.target.value })
//                   }
//                 >
//                   <option value="">Select Property</option>
//                   {properties.map((p) => (
//                     <option key={p._id} value={p._id}>
//                       {p.propertyName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="label">Floor</label>
//                 <select
//                   className="input"
//                   value={tenantForm.floorId}
//                   onChange={(e) =>
//                     setTenantForm({ ...tenantForm, floorId: e.target.value })
//                   }
//                 >
//                   <option value="">Select Floor</option>
//                   {floors.map((f) => (
//                     <option key={f._id} value={f._id}>
//                       {f.floorName || `Floor ${f.floorNumber}`}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="label">Unit</label>
//                 <select
//                   className="input"
//                   value={tenantForm.unitId}
//                   onChange={(e) =>
//                     setTenantForm({ ...tenantForm, unitId: e.target.value })
//                   }
//                 >
//                   <option value="">Select Unit</option>
//                   {units.map((u) => (
//                     <option key={u._id} value={u._id}>
//                       {u.unitNumber}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 border-t flex justify-end">
//               <button
//                 onClick={saveTenant}
//                 disabled={loading}
//                 className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg transition"
//               >
//                 {isEditMode ? "Update Tenant" : "Save Tenant"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= API ================= */
const API = {
  tenants: "http://localhost:5000/api/tenants",
  properties: "http://localhost:5000/api/properties",
  floors: "http://localhost:5000/api/floors",
  units: "http://localhost:5000/api/units",
};

/* ================= HELPERS ================= */
const generateTenantCode = () =>
  "TEN-" + Math.random().toString(36).substring(2, 7).toUpperCase();

const getInitialTenant = () => ({
  tenantCode: generateTenantCode(),
  fullName: "",
  phone: "",
  propertyId: "",
  floorId: "",
  unitId: "",
  rentAmount: "",
  maintenanceAmount: "",
  leaseStartDate: "",
  aadhaarCard: null,
  panCard: null,
  bondPaper: null,
});

/* ================= COMPONENT ================= */
export default function Tenants() {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);

  const [tenantForm, setTenantForm] = useState(getInitialTenant());
  const [openTenant, setOpenTenant] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadTenants = async () => {
    const res = await axios.get(API.tenants);
    setTenants(res.data.data || []);
  };

  useEffect(() => {
    loadTenants();
    axios.get(API.properties).then((r) => setProperties(r.data.data || []));
  }, []);

  useEffect(() => {
    if (!tenantForm.propertyId) return;
    axios
      .get(`${API.floors}/property/${tenantForm.propertyId}`)
      .then((r) => setFloors(r.data.data || []));
  }, [tenantForm.propertyId]);

  useEffect(() => {
    if (!tenantForm.floorId) return;
    axios.get(`${API.units}/property/${tenantForm.propertyId}`).then((r) => {
      setUnits(
        (r.data.data || []).filter(
          (u) =>
            u.floorId?._id === tenantForm.floorId &&
            u.availabilityStatus === "Available",
        ),
      );
    });
  }, [tenantForm.floorId]);

  /* ================= ACTIONS ================= */
  const saveTenant = async () => {
    if (
      !tenantForm.fullName ||
      !tenantForm.propertyId ||
      !tenantForm.floorId ||
      !tenantForm.unitId ||
      !tenantForm.rentAmount ||
      !tenantForm.leaseStartDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...tenantForm,
        rentAmount: Number(tenantForm.rentAmount),
        maintenanceAmount: Number(tenantForm.maintenanceAmount || 0),
      };

      if (isEditMode) {
        await axios.put(`${API.tenants}/${editingTenantId}`, payload);
      } else {
        await axios.post(API.tenants, payload);
      }

      setOpenTenant(false);
      setTenantForm(getInitialTenant());
      setIsEditMode(false);
      setEditingTenantId(null);
      loadTenants();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save tenant");
    } finally {
      setLoading(false);
    }
  };

  const editTenant = (tenant) => {
    setTenantForm({
      tenantCode: tenant.tenantCode,
      fullName: tenant.fullName,
      phone: tenant.phone,
      propertyId: tenant.propertyId?._id || "",
      floorId: tenant.floorId?._id || "",
      unitId: tenant.unitId?._id || "",
      rentAmount: tenant.rentAmount,
      maintenanceAmount: tenant.maintenanceAmount,
      leaseStartDate: tenant.leaseStartDate?.slice(0, 10),
    });

    setEditingTenantId(tenant._id);
    setIsEditMode(true);
    setOpenTenant(true);
  };

  const deleteTenant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    await axios.delete(`${API.tenants}/${id}`);
    loadTenants();
  };

  const handleUnitSelect = (unitId) => {
    const selectedUnit = units.find((u) => u._id === unitId);

    if (!selectedUnit) return;

    setTenantForm((prev) => ({
      ...prev,
      unitId,
      rentAmount: selectedUnit.rentAmount || "",
      maintenanceAmount: selectedUnit.maintenanceCharge || "",
    }));
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Tenant Management</h1>
          <p className="text-sm text-gray-500">
            Property-wise tenant, rent & maintenance tracking
          </p>
        </div>

        <button
          onClick={() => {
            setTenantForm(getInitialTenant());
            setIsEditMode(false);
            setOpenTenant(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tenants.map((t) => (
          <div
            key={t._id}
            className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{t.fullName}</h3>
                  <p className="text-xs text-gray-500">
                    Tenant Code: {t.tenantCode}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    t.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Flat {t.unitId?.unitNumber} • {t.propertyId?.propertyName}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Rent</p>
                  <p className="font-semibold">₹{t.rentAmount}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Maintenance</p>
                  <p className="font-semibold">₹{t.maintenanceAmount}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
              <button
                onClick={() => navigate(`/admin/dashboard/tenants/${t._id}`)}
                className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg py-2 transition"
              >
                Manage
              </button>
              <button
                onClick={() => editTenant(t)}
                className="bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white rounded-lg py-2 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTenant(t._id)}
                className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-lg py-2 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {openTenant && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {isEditMode ? "Edit Tenant" : "Add Tenant"}
              </h2>
              <button
                onClick={() => setOpenTenant(false)}
                className="text-2xl leading-none hover:text-red-500"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tenant basic info */}
              <div>
                <label className="label">Tenant Code</label>
                <input
                  className="input bg-gray-100 cursor-not-allowed"
                  value={tenantForm.tenantCode}
                  disabled
                />
              </div>

              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  placeholder="Enter tenant full name"
                  value={tenantForm.fullName}
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, fullName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input
                  className="input"
                  placeholder="Enter phone number"
                  value={tenantForm.phone}
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label">Lease Start Date</label>
                <input
                  type="date"
                  className="input"
                  value={tenantForm.leaseStartDate}
                  onChange={(e) =>
                    setTenantForm({
                      ...tenantForm,
                      leaseStartDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* Property selection flow */}
              <div>
                <label className="label">Property</label>
                <select
                  className="input"
                  value={tenantForm.propertyId}
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, propertyId: e.target.value })
                  }
                >
                  <option value="">Select Property</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Floor</label>
                <select
                  className="input"
                  value={tenantForm.floorId}
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, floorId: e.target.value })
                  }
                >
                  <option value="">Select Floor</option>
                  {floors.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.floorName || `Floor ${f.floorNumber}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Unit</label>
                <select
                  className="input"
                  value={tenantForm.unitId}
                  onChange={(e) => handleUnitSelect(e.target.value)}
                >
                  <option value="">Select Unit</option>
                  {units.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.unitNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-filled charges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Monthly Rent</label>
                  <select
                    className="input bg-white cursor-pointer w-full"
                    value={tenantForm.rentAmount}
                  >
                    <option>
                      {tenantForm.rentAmount
                        ? `₹${tenantForm.rentAmount}`
                        : "Select Unit First"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="label">Maintenance Charges</label>
                  <select
                    className="input bg-white cursor-pointer w-full"
                    value={tenantForm.maintenanceAmount}
                  >
                    <option>
                      {tenantForm.maintenanceAmount
                        ? `₹${tenantForm.maintenanceAmount}`
                        : "Select Unit First"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Attachments section */}
              <div className="sm:col-span-2">
                <p className="font-medium mb-1">Attachments</p>
                <p className="text-xs text-gray-500 mb-3">
                  All attachment fields are optional
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">
                      Aadhaar Card{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      className="input"
                      onChange={(e) =>
                        setTenantForm({
                          ...tenantForm,
                          aadhaarCard: e.target.files[0],
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="label">
                      PAN Card <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      className="input"
                      onChange={(e) =>
                        setTenantForm({
                          ...tenantForm,
                          panCard: e.target.files[0],
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="label">
                      Bond Agreement{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      className="input"
                      onChange={(e) =>
                        setTenantForm({
                          ...tenantForm,
                          bondPaper: e.target.files[0],
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={saveTenant}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg transition"
              >
                {isEditMode ? "Update Tenant" : "Save Tenant"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
