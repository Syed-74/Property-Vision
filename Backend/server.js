const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const floorRoutes = require("./routes/floor.routes");
const unitRoutes = require("./routes/unit.routes");
const tenantRoutes = require("./routes/tenant.routes");
const paymentRoutes = require("./routes/payment.routes");


dotenv.config();
connectDB();


const app = express();
app.use("/uploads", express.static("uploads"));
// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/auth/v1/admin", authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/floors', floorRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/payments", paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
