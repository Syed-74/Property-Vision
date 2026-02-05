const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceiptPDF = (rent, tenant, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Stream header
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Receipt-${rent.month}-${tenant.fullName}.pdf`
  );

  doc.pipe(res);

  // --- HEADER ---
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("RENT RECEIPT", 110, 57)
    .fontSize(10)
    .text("Property Vision Pvt Ltd.", 200, 65, { align: "right" })
    .text("Generated on: " + new Date().toLocaleDateString(), 200, 80, { align: "right" })
    .moveDown();

  // Draw a line
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 100)
    .lineTo(550, 100)
    .stroke();

  // --- TENANT INFO ---
  let customerInformationTop = 130;

  doc
    .fontSize(10)
    .text("Receipt Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(rent._id.toString().slice(-6).toUpperCase(), 150, customerInformationTop)
    .font("Helvetica")
    .text("Payment Date:", 50, customerInformationTop + 15)
    .text(rent.paidOn ? new Date(rent.paidOn).toLocaleDateString() : new Date().toLocaleDateString(), 150, customerInformationTop + 15)
    .text("Payment Method:", 50, customerInformationTop + 30) // Assuming cash/online generic
    .text(rent.paymentStatus, 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text("Tenant Details:", 300, customerInformationTop)
    .font("Helvetica")
    .text(tenant.fullName, 300, customerInformationTop + 15)
    .text(`Unit: ${tenant.unitId?.unitNumber || "N/A"}`, 300, customerInformationTop + 30)
    .text(`Phone: ${tenant.phone || "N/A"}`, 300, customerInformationTop + 45)
    .moveDown();

  // --- TABLE HEADER ---
  const tableTop = 250;
  const itemCodeX = 50;
  const descriptionX = 150;
  const priceX = 400;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Description", itemCodeX, tableTop)
    .text("Month", descriptionX, tableTop)
    .text("Amount", priceX, tableTop, { align: "right" });

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // --- TABLE ROWS ---
  let y = tableTop + 25;
  const rentRowY = y;

  doc
    .font("Helvetica")
    .text("House Rent", itemCodeX, rentRowY)
    .text(rent.month, descriptionX, rentRowY)
    .text(formatCurrency(rent.rentAmount), priceX, rentRowY, { align: "right" });

  y += 20;

  if (rent.maintenanceAmount > 0) {
    doc
      .text("Maintenance", itemCodeX, y)
      .text(rent.month, descriptionX, y)
      .text(formatCurrency(rent.maintenanceAmount), priceX, y, { align: "right" });
    y += 20;
  }

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y + 10)
    .lineTo(550, y + 10)
    .stroke();

  // --- TOTAL ---
  y += 20;
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Total Paid:", 300, y)
    .text(formatCurrency(rent.totalAmount), priceX, y, { align: "right" });

  // --- FOOTER ---
  doc
    .fontSize(10)
    .text(
      "Thank you for your timely payment.",
      50,
      700,
      { align: "center", width: 500 }
    );

  doc.end();
};

function formatCurrency(amount) {
  return "INR " + (amount).toFixed(2);
}

module.exports = { generateReceiptPDF };
