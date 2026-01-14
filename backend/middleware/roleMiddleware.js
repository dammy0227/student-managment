export const allowRoles = (...roles) => {
  const allowed = roles.map(role => role.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
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
