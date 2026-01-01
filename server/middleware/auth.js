const isAuthenticated = (req, res, next) => {
  // For local development, create a mock user
  req.user = {
    _id: 'local-user',
    displayName: 'Local User',
    email: 'local@test.com'
  };
  return next();
};

module.exports = { isAuthenticated };
