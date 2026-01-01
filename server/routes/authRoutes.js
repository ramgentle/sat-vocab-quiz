const express = require('express');
const passport = require('passport');
const { getCurrentUser, logout, checkAuth } = require('../controllers/authController');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/dashboard');
  }
);

router.get('/current-user', getCurrentUser);

router.post('/logout', logout);

router.get('/check', checkAuth);

module.exports = router;
