const mongoose = require("mongoose");

const propertiesManagementSchema = new mongoose.Schema(
  {
    /* =========================
       1. Core Property Info
    ========================== */
    propertyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    propertyName: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: [
        "House",
        "Flat",
        "Land",
        "Commercial",
        "Residential",
        "Apartment",
        "Townhouse",
        "Condo",
        "Villa",
        "Farmhouse",
        "Penthouse",
        "Studio",
        "Loft",
        "Warehouse",
        "Office",
        "Shop",
        "Retail Space",
        "Industrial Space",
        "Plot",
        "Agricultural Land",
        "Residential Plot",
        "Commercial Plot",
        "Mixed Used Space",
        "Hotel",
        "Resort",
        "Luxury Villa",
        "Luxury Apartment",
        "Luxury Condo",
        "Luxury Townhouse",
        "Luxury House",
        "Luxury Flat",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    ownershipType: {
      type: String,
      enum: ["Owned", "Leased", "Managed", "Other"],
      default: "Owned",
    },

    /* =========================
       2. Location Details
    ========================== */
    location: {
      country: {
        type: String,
        enum: [
          "India",
          "USA",
          "UK",
          "Canada",
          "Australia",
          "Dubai",
          "Singapore",
          "Kuwait",
          "saudi arabia",
          "Qatar",
          "Bahrain",
          "Other",
        ],
        required: true,
      },
      state: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String },
      address: { type: String, required: true },
      landmark: { type: String },
      pincode: { type: String },
    },

    /* =========================
       3. Physical Details
    ========================== */
    physicalDetails: {
      totalArea: { type: String }, // sq ft
      builtUpArea: { type: String },
      numberOfFloors: { type: String },
      yearBuilt: { type: String },
      parkingAvailable: { type: Boolean, default: false },
      waterSupplyType: { type: String },
      electricityMeterNumber: { type: String },
    },

    /* =========================
       4. Documents
    ========================== */
    documents: [
      {
        documentId: { type: String },
        documentType: {
          type: String,
          enum: [
            "Sale Deed",
            "Tax Receipt",
            "Registration",
            "NOC",
            "Agreement",
            "Other",
          ],
        },
        documentUrl: { type: String, required: true },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        verificationStatus: {
          type: String,
          enum: ["Pending", "Verified", "Rejected"],
          default: "Pending",
        },
      },
    ],

    /* =========================
       5. Status & Lifecycle
    ========================== */
    propertyStatus: {
      type: String,
      enum: ["Active", "Inactive", "Sold", "Rented", "Under Maintenance"],
      default: "Active",
    },
    propertyimgUrl: { type: String, required: true },

    availabilityStatus: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    /* =========================
       6. Ownership & Management
    ========================== */
    owner: {
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      ownerName: { type: String },
      contactNumber: { type: String },
      email: { type: String },
    },

    managedBy: {
      type: String,
      enum: ["Admin", "Staff", "Agency"],
      default: "Admin",
    },

    /* =========================
       7. Financial Details
    ========================== */
    financialDetails: {
      purchasePrice: { type: Number },
      currentMarketValue: { type: Number },
      propertyTaxAmount: { type: Number },
      maintenanceCost: { type: Number },
      currency: { type: String, default: "INR" },
    },

    /* =========================
       8. System & Audit Fields
    ========================== */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    remarks: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin", // Admin reference
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin", // Admin reference
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  },
);

module.exports =
  mongoose.models.PropertiesManagement ||
  mongoose.model("PropertiesManagement", propertiesManagementSchema);
