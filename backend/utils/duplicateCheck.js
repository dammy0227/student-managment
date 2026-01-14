import Project from '../models/Project.js';

export const checkDuplicateTitle = async (title) => {
  try {
    const existing = await Project.findOne({ title });
    return !!existing;
  } catch (err) {
    console.error('Error checking duplicate title:', err.message);
    return false;
  }
};
 