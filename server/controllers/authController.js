const getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        profilePicture: req.user.profilePicture
      }
    });
  } else {
    res.json({ user: null });
  }
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
};

const checkAuth = (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
};

module.exports = { getCurrentUser, logout, checkAuth };
