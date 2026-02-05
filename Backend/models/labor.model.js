const mongoose = require("mongoose");

const laborSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    mobileNumber: {
      type: String,
      required: true
    },

    alternateNumber: {
      type: String
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    idProofType: {
      type: String,
      enum: ["Aadhaar", "Voter ID", "Driving License"],
      required: true
    },

    idProofNumber: {
      type: String,
      required: true,
      unique: true
    },

    profileImage: {
      type: String // store image URL (Cloudinary/S3/local)
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Labor", laborSchema);
