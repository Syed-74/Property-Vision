const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    /* ================= 1️⃣ BASIC TENANT INFORMATION ================= */

    tenantId: {
      type: String,
      required: true,
      unique: true,
      index: true, // TEN-0001
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dateOfBirth: {
      type: Date,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    nationality: {
      type: String,
    },

    profilePhoto: {
      type: String, // image path / URL
    },

    /* ================= 2️⃣ CONTACT INFORMATION ================= */

    mobileNumber: {
      type: String,
      required: true,
    },

    alternatePhoneNumber: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    /* ================= 3️⃣ IDENTITY & LEGAL DOCUMENTS ================= */

    idType: {
      type: String,
      enum: ["Aadhaar", "Passport", "Driving License", "Voter ID"],
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
    },

    idDocument: {
      type: String, // file path
    },

    policeVerificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    /* ================= 4️⃣ ADDRESS DETAILS ================= */

    currentAddressLine1: {
      type: String,
      required: true,
    },

    currentAddressLine2: {
      type: String,
    },

    currentCity: {
      type: String,
      required: true,
    },

    currentState: {
      type: String,
      required: true,
    },

    currentCountry: {
      type: String,
      required: true,
    },

    currentPincode: {
      type: String,
      required: true,
    },

    /* ================= SYSTEM & STATUS ================= */

    tenantStatus: {
      type: String,
      enum: ["Active", "Notice Period", "Vacated", "Blacklisted"],
      default: "Active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin", // Admin reference
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

module.exports = Tenant;
