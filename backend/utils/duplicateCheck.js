const Project = require('../models/Project');

const checkDuplicateTitle = async (title) => {
  try {
    const existing = await Project.findOne({ title });
    return !!existing;
  } catch (err) {
    console.error('Error checking duplicate title:', err.message);
    return false; // fail-safe
  }
};

module.exports = { checkDuplicateTitle };
