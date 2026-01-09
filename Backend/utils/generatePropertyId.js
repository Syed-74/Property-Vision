const PropertiesManagement = require('../models/PropertiesManagement');


const generatePropertyId = async () => {
  const count = await PropertiesManagement.countDocuments();
  const nextNumber = count + 1;

  return `PROP-${String(nextNumber).padStart(5, '0')}`;
};

module.exports = generatePropertyId;
