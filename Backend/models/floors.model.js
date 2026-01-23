const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema(
  {
    /* =========================
       Property Reference
    ========================== */
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertiesManagement",
      required: true,
      index: true,
    },

    /* =========================
       Floor Identity
    ========================== */
    floorNumber: {
      type: Number, // 0 = Ground, 1 = First, etc.
      required: true,
    },

    floorName: {
      type: String, // "Ground Floor", "First Floor"
      trim: true,
    },

    floorType: {
      type: String,
      enum: ["Residential", "Commercial", "Mixed"],
      default: "Residential",
    },

    /* =========================
       Units (Optional / Informational)
       ⚠ Prefer calculating from Flats collection
    ========================== */
    totalUnits: {
      type: Number,
      min: 0,
    },

    /* =========================
       Status & Soft Delete
    ========================== */
    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Floor", floorSchema);
