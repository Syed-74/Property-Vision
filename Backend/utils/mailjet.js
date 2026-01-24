const Mailjet = require("node-mailjet");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

exports.sendResetEmail = async ({ to, name, resetUrl }) => {
  try {
    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_SECRET_KEY;

    const auth = Buffer.from(
      `${apiKey}:${apiSecret}`
    ).toString("base64");

    const result = await axios.post(
      "https://api.mailjet.com/v3.1/send",
      {
        Messages: [
          {
            From: {
              Email: "finessecustomizesolutions@gmail.com", // ✅ verified
              Name: "Property Vision",
            },

            // ✅ FIX 1: To must be array of objects
            To: [
              {
                Email: to,
                Name: name || "User",
              },
            ],

            Subject: "Reset your password",
            HTMLPart: `<a href="${resetUrl}">Reset Password</a>`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json", // ✅ FIX 2
        },
      }
    );

    // ✅ FIX 3: axios response is in data
    console.log("Mailjet success:", result.data);
  } catch (error) {
    console.error(
      "Mailjet error:",
      error?.response?.data || error.message
    );
    throw new Error("Email could not be sent");
  }
};

