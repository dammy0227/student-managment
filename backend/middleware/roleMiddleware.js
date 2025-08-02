// backend/middleware/roleMiddleware.js
const allowRoles = (...roles) => {
  const allowed = roles.map(role => role.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      // console.error('❌ No user on request in allowRoles');
      return res.status(401).json({ message: 'Not authorized: user missing' });
    }

    const userRole = req.user.role?.toLowerCase();
    console.log('🔥 ROLE CHECK:', userRole);

    if (!allowed.includes(userRole)) {
      console.log('⛔ Role not allowed:', userRole);
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    console.log('✅ Role is allowed');
    next();
  };
};



module.exports = { 
  allowRoles, // ✅ make sure this is exported as a named export
};
