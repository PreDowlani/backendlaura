// middleware/authorizeAdmin.js
module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      // El usuario tiene el rol "admin", permitir la solicitud
      return next();
    } else {
      res.status(403).json({ error: 'Acceso denegado' });
    }
  };
  