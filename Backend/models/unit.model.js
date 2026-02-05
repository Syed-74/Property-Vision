const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertiesManagement",
      required: true,
      index: true,
    },

    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
      index: true,
    },

    unitNumber: {
      type: String,
      required: true,
      trim: true,
    },

    unitType: {
      type: String,
      enum: ["Flat", "Studio", "Duplex", "Penthouse"],
      default: "Flat",
    },

    builtUpArea: Number,
    carpetArea: Number,
    squareFeet: {
      type: Number,
      required: true,
    },

    squareMeters: {
      type: Number,
      required: true,
    },

    squareRate: {
      type: Number,
      required: true,
    },

    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,

    rentAmount: Number,
    securityDeposit: Number,
    maintenanceCharge: Number,

    availabilityStatus: {
      type: String,
      enum: ["Available", "Occupied", "Reserved"],
      default: "Available",
    },

    furnishingStatus: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully-Furnished"],
      default: "Unfurnished",
    },

    parkingAvailable: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Unit", unitSchema);
