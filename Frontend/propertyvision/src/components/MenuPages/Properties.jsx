import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* =========================
   CONFIG
========================= */
const API_URL = "http://localhost:5000/api/properties";

const propertyTypes = [
  "House", "Flat", "Land", "Commercial", "Residential", "Apartment", "Townhouse",
  "Condo", "Villa", "Farmhouse", "Penthouse", "Studio", "Loft", "Warehouse", "Office",
  "Shop", "Retail Space", "Industrial Space", "Plot", "Agricultural Land",
  "Residential Plot", "Commercial Plot", "Mixed Used Space", "Hotel", "Resort",
  "Luxury Villa", "Luxury Apartment", "Luxury Condo", "Luxury Townhouse",
  "Luxury House", "Luxury Flat", "Other"
];


const initialForm = {
  propertyName: "",
  propertyType: "House",
  description: "",
  ownershipType: "Owned",
  location: {
    country: "",
    state: "",
    city: "",
    address: "",
    area: "",
    pincode: "",
  },
  physicalDetails: {
    totalArea: "",
    builtUpArea: "",
    numberOfFloors: "",
    yearBuilt: "",
    propertyimgUrl: null,
    parkingAvailable: false,
  },
  financialDetails: {
    purchasePrice: "",
    currentMarketValue: "",
    propertyTaxAmount: "",
    maintenanceCost: "",
    currency: "INR",
  },
};


/* =========================
   VALIDATION
========================= */
const validateStep = (step, data) => {
  const errors = {};

  if (step === 1 && !data.propertyName)
    errors.propertyName = "Property name is required";

  if (step === 2) {
    ["country", "state", "city", "address"].forEach(f => {
      if (!data.location[f]) errors[f] = `${f} is required`;
    });
  }

  if (step === 3 && !data.physicalDetails.totalArea)
    errors.totalArea = "Total area is required";

  if (step === 4 && !data.financialDetails.purchasePrice)
    errors.purchasePrice = "Purchase price is required";

  return errors;
};

const Info = ({ label, value, full }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium break-words">{value}</p>
  </div>
);


const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

    const navigate = useNavigate(); // ✅ HERE

  /* TOAST */
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /* =========================
     FETCH
  ========================== */
  const fetchProperties = async () => {
    setLoading(true);
    const res = await axios.get(API_URL);
    setProperties(res.data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /* =========================
     TOAST
  ========================== */
  const showValidationToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  /* =========================
     FORM HELPERS
  ========================== */
  const updateField = (section, field, value) => {
    if (!section) {
      setFormData(p => ({ ...p, [field]: value }));
    } else {
      setFormData(p => ({
        ...p,
        [section]: { ...p[section], [field]: value },
      }));
    }
  };

  const nextStep = () => {
    const e = validateStep(step, formData);
    if (Object.keys(e).length) {
      showValidationToast(Object.values(e)[0]);
      return;
    }
    setStep(step + 1);
  };

  // const submit = async () => {
  //   const e = validateStep(step, formData);
  //   if (Object.keys(e).length) {
  //     showValidationToast(Object.values(e)[0]);
  //     return;
  //   }

  //   if (isEdit) {
  //     await axios.put(`${API_URL}/${selectedProperty._id}`, formData);
  //   } else {
  //     await axios.post(API_URL, formData);
  //   }

  //   fetchProperties();
  //   closeForm();
  // };

  const submit = async () => {
  const e = validateStep(step, formData);
  if (Object.keys(e).length) {
    showValidationToast(Object.values(e)[0]);
    return;
  }

  try {
    const payload = new FormData();

    payload.append("propertyName", formData.propertyName);
    payload.append("propertyType", formData.propertyType);
    payload.append("ownershipType", formData.ownershipType);
    payload.append("description", formData.description || "");
    payload.append("propertyimgUrl", formData.propertyimgUrl);

    payload.append("location", JSON.stringify(formData.location));
    payload.append("physicalDetails", JSON.stringify(formData.physicalDetails));
    payload.append("financialDetails", JSON.stringify(formData.financialDetails));

    if (isEdit) {
      await axios.put(
        `${API_URL}/${selectedProperty._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      await axios.post(API_URL, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    fetchProperties();
    closeForm();
  } catch (err) {
    showValidationToast(
      err?.response?.data?.message || "Something went wrong"
    );
  }
};

  const closeForm = () => {
    setOpenForm(false);
    setIsEdit(false);
    setFormData(initialForm);
    setStep(1);
  };

  /* =========================
     DELETE
  ========================== */
  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchProperties();
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Property Management</h1>
          <p className="text-sm text-gray-500">Manage all properties</p>
        </div>
        <button
          onClick={() => setOpenForm(true)}
          className="bg-[#9c4a1a] text-white px-4 py-2 rounded-lg"
        >
          + Add Property
        </button>
      </div>
{/* STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Total Properties</p>
    <p className="text-2xl font-semibold">{properties.length}</p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Active Properties</p>
    <p className="text-2xl font-semibold text-green-600">
      {properties.filter(p => p.propertyStatus !== "Inactive").length}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Inactive Properties</p>
    <p className="text-2xl font-semibold text-red-600">
      {properties.filter(p => p.propertyStatus === "Inactive").length}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Portfolio Value</p>
    <p className="text-2xl font-semibold">₹—</p>
  </div>
</div>

      {/* PROPERTY CARDS */}
<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-lg font-semibold mb-4">Properties</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {loading ? (
      <div className="col-span-full text-center py-10">
        Loading...
      </div>
  ) : properties.map(p => (
    <div
      key={p._id}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-44">
      <img
  src={
    p.propertyimgUrl
      ? `http://localhost:5000${p.propertyimgUrl}`
      : "https://via.placeholder.com/600x400"
  }
  alt={p.propertyName}
  className="w-full h-full object-cover"
/>


        {/* TYPE BADGE */}
        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {p.propertyType}
        </span>

        {/* STATUS BADGE */}
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          {p.propertyStatus || "Active"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold truncate">
          {p.propertyName}
        </h3>

        <p className="text-sm text-gray-500">
          {p.location?.address || "—"}, {p.location?.city || "—"}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Total Units</p>
            <p className="font-semibold">
              {p.totalUnits || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Occupancy</p>
            <p className="font-semibold text-green-600">
              {p.occupancy || "—"}%
            </p>
          </div>
        </div>

        {/* PRICE */}
        <div className="pt-2">
          <p className="text-xl font-bold">
            ₹{p.financialDetails?.currentMarketValue || "—"}
          </p>
          <p className="text-xs text-gray-400">
            Monthly Revenue
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="border-t px-5 py-3 flex justify-between text-sm">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setSelectedProperty(p);
            setOpenView(true);
          }}
        >
          View
        </button>

        <button
          className="text-indigo-600 hover:underline"
          onClick={() => {
            setSelectedProperty(p);
            setFormData(p);
            setIsEdit(true);
            setOpenForm(true);
          }}
        >
          Edit
        </button>
        <button
          className="text-red-600 hover:underline"
          onClick={() => deleteProperty(p._id)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                {isEdit ? "Edit Property" : "Add Property"}
              </h2>
              <button onClick={closeForm} className="text-2xl">&times;</button>
            </div>

        
            {/* STEP INDICATOR */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                {["Basic Info", "Location", "Details", "Review"].map((label, index) => {
                  const s = index + 1;
                  const active = step === s;
                  const done = step > s;

                  return (
                    <div key={label} className="flex-1 flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold
                    ${active ? "bg-[#9c4a1a] text-white"
                            : done ? "bg-green-600 text-white"
                              : "bg-gray-300 text-gray-700"}`}
                      >
                        {s}
                      </div>
                      <span
                        className={`ml-2 hidden sm:block
                    ${active ? "text-indigo-600 font-semibold"
                            : "text-gray-500"}`}
                      >
                        {label}
                      </span>
                      {s !== 4 && <div className="flex-1 h-[2px] mx-2 bg-gray-300" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[80vh] overflow-y-auto text-sm space-y-8">

              {/* STEP 1 – BASIC INFO */}
              {step === 1 && (
                <section className="space-y-6">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label>Property Name</label>
                      <input className="input"
                        value={formData.propertyName}
                        onChange={e => updateField(null, "propertyName", e.target.value)} />
                    </div>

                    <div>
                      <label>Property Type</label>
                      <select className="input"
                        value={formData.propertyType}
                        onChange={e => updateField(null, "propertyType", e.target.value)}>
                        {propertyTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label>Ownership Type</label>
                      <select className="input"
                        value={formData.ownershipType}
                        onChange={e => updateField(null, "ownershipType", e.target.value)}>
                        <option>Owned</option>
                        <option>Leased</option>
                        <option>Managed</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label>Description</label>
                      <textarea className="input"
                        value={formData.description}
                        onChange={e => updateField(null, "description", e.target.value)} />
                    </div>
                  </div>
                </section>
              )}

              {/* STEP 2 – LOCATION */}
              {step === 2 && (
                <section className="space-y-6">
                  <h3 className="font-semibold text-lg">Location Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["country", "state", "city", "area", "address", "pincode"].map(f => (
                      <div key={f}>
                        <label className="capitalize">{f}</label>
                        <input className="input"
                          value={formData.location[f] || ""}
                          onChange={e => updateField("location", f, e.target.value)} />
                      </div>
                    ))}

                    {/* <div>
                      <label>Latitude</label>
                      <input type="number" className="input"
                        onChange={e => updateField("location", "latitude", e.target.value)} />
                    </div>

                    <div>
                      <label>Longitude</label>
                      <input type="number" className="input"
                        onChange={e => updateField("location", "longitude", e.target.value)} />
                    </div> */}
                  </div>
                </section>
              )}

              {/* STEP 3 – PROPERTY DETAILS */}
             {step === 3 && (
  <section className="space-y-8">

    {/* PHYSICAL DETAILS */}
    <div>
      <h3 className="font-semibold text-lg mb-4">Physical Details</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {["totalArea", "builtUpArea", "numberOfFloors", "yearBuilt"].map(f => (
          <div key={f}>
            <label className="capitalize">{f}</label>
            <input
              type="text"
              className="input"
              value={formData.physicalDetails[f] || ""}
              onChange={e =>
                updateField("physicalDetails", f, e.target.value)
              }
            />
          </div>
        ))}

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={formData.physicalDetails.parkingAvailable || false}
            onChange={e =>
              updateField(
                "physicalDetails",
                "parkingAvailable",
                e.target.checked
              )
            }
          />
          <label>Parking Available</label>
        </div>
      </div>
    </div>

             <div>
      <h3 className="font-semibold text-lg mb-4">Property Image</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block mb-1">Upload Property Image</label>
          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) =>
              updateField(null, "propertyimgUrl", e.target.files[0])
            }
          />
        </div>
      </div>
    </div>

     <div>
      <h3 className="font-semibold text-lg mb-4">Financial Details</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          "purchasePrice",
          "currentMarketValue",
          "propertyTaxAmount",
          "maintenanceCost",
        ].map(f => (
          <div key={f}>
            <label className="capitalize">{f}</label>
            <input
              type="number"
              className="input"
              value={formData.financialDetails[f] || ""}
              onChange={e =>
                updateField("financialDetails", f, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  </section>
)}


              {/* STEP 4 – REVIEW */}
              {step === 4 && (
                <section className="space-y-6">
                  <h3 className="font-semibold text-lg">Review & Submit</h3>

                  <div className="bg-gray-50 border rounded-lg p-4 grid sm:grid-cols-2 gap-3">
                    <p><b>Name:</b> {formData.propertyName}</p>
                    <p><b>Type:</b> {formData.propertyType}</p>
                    <p><b>City:</b> {formData.location.city}</p>
                    <p><b>Total Area:</b> {formData.physicalDetails.totalArea}</p>
                    <p><b>Purchase Price:</b> {formData.financialDetails.purchasePrice}</p>
                  </div>
                </section>
              )}

              {/* ACTIONS */}
              <div className="flex justify-between pt-6 border-t">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="border px-4 py-2 rounded"
                  >
                    Back
                  </button>
                )}

                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    className="bg-[#9c4a1a] text-white px-6 py-2 rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    className="bg-green-600 text-white px-6 py-2 rounded"
                  >
                    {isEdit ? "Update Property" : "Submit Property"}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}



      {/* VIEW DETAILS MODAL */}
      {/* VIEW DETAILS MODAL */}
      {openView && selectedProperty && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Property Details</h2>
                <p className="text-xs text-gray-500">
                  Property ID: {selectedProperty.propertyId}
                </p>
              </div>
              <button
                onClick={() => setOpenView(false)}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8 text-sm">

              {/* STATUS BAR */}
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                  {selectedProperty.propertyStatus}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                  {selectedProperty.availabilityStatus}
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                  {selectedProperty.approvalStatus}
                </span>
              </div>

              {/* CORE INFO */}
              <section className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-4">Core Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Info label="Name" value={selectedProperty.propertyName} />
                  <Info label="Type" value={selectedProperty.propertyType} />
                  <Info label="Ownership" value={selectedProperty.ownershipType} />
                  <Info label="Description" value={selectedProperty.description || "—"} full />
                </div>
              </section>

              {/* LOCATION */}
              <section className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-4">Location Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Info label="Country" value={selectedProperty.location?.country} />
                  <Info label="State" value={selectedProperty.location?.state} />
                  <Info label="City" value={selectedProperty.location?.city} />
                  <Info label="Area" value={selectedProperty.location?.area || "—"} />
                  <Info label="Address" value={selectedProperty.location?.address} />
                  <Info label="Landmark" value={selectedProperty.location?.landmark || "—"} />
                  <Info label="Pincode" value={selectedProperty.location?.pincode || "—"} />
                  {/* <Info label="Latitude" value={selectedProperty.location?.latitude || "—"} />
                  <Info label="Longitude" value={selectedProperty.location?.longitude || "—"} /> */}
                </div>
              </section>

              {/* PHYSICAL */}
              <section className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-4">Physical Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Info label="Total Area" value={selectedProperty.physicalDetails?.totalArea} />
                  <Info label="Built-up Area" value={selectedProperty.physicalDetails?.builtUpArea || "—"} />
                  <Info label="Floors" value={selectedProperty.physicalDetails?.numberOfFloors || "—"} />
                  <Info label="Year Built" value={selectedProperty.physicalDetails?.yearBuilt || "—"} />
                  <Info
                    label="Parking"
                    value={selectedProperty.physicalDetails?.parkingAvailable ? "Yes" : "No"}
                  />
                  <Info
                    label="Water Supply"
                    value={selectedProperty.physicalDetails?.waterSupplyType || "—"}
                  />
                  <Info
                    label="Electricity Meter"
                    value={selectedProperty.physicalDetails?.electricityMeterNumber || "—"}
                  />
                </div>
              </section>

              {/* FINANCIAL */}
              <section className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-4">Financial Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Info label="Purchase Price" value={selectedProperty.financialDetails?.purchasePrice} />
                  <Info label="Market Value" value={selectedProperty.financialDetails?.currentMarketValue || "—"} />
                  <Info label="Property Tax" value={selectedProperty.financialDetails?.propertyTaxAmount || "—"} />
                  <Info label="Maintenance Cost" value={selectedProperty.financialDetails?.maintenanceCost || "—"} />
                  <Info label="Currency" value={selectedProperty.financialDetails?.currency} />
                </div>
              </section>

              {/* DOCUMENTS */}
              {selectedProperty.documents?.length > 0 && (
                <section className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold mb-4">Documents</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProperty.documents.map((doc, i) => (
                      <div key={i} className="border rounded-lg p-4 bg-white">
                        <p className="font-medium">{doc.documentType}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          Status: {doc.verificationStatus}
                        </p>
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 underline text-sm"
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SYSTEM */}
              <section className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-4">System Info</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Info label="Created At" value={new Date(selectedProperty.createdAt).toLocaleString()} />
                  <Info label="Updated At" value={new Date(selectedProperty.updatedAt).toLocaleString()} />
                  <Info label="Remarks" value={selectedProperty.remarks || "—"} full />
                </div>
              </section>

            </div>
          </div>
        </div>
      )}


      {/* VALIDATION TOAST */}
      {showToast && (
        <div className="fixed top-24 left-4 z-[9999] animate-slide-in-left">
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg">
            ⚠ {toastMessage}
          </div>
        </div>
      )}
      
    </div>

    </div>
  );
  
};

export default Properties;
