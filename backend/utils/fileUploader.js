const multer = require('multer');

const storage = multer.memoryStorage(); // ⚠️ Must be memory storage
const upload = multer({ storage });

module.exports = upload;
