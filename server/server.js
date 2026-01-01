require('dotenv').config();
const express = require('express');
const cors = require('cors');
const localStore = require('./data/localStore');

const wordRoutes = require('./routes/wordRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// Load words and users from JSON files
localStore.loadWords();
localStore.loadUsers();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to extract user from session token
app.use((req, res, next) => {
  const sessionToken = req.headers['x-session-token'];
  if (sessionToken) {
    const session = localStore.getUserBySession(sessionToken);
    if (session) {
      req.user = {
        _id: session.userId,
        displayName: session.displayName,
        username: session.username
      };
    }
  }
  next();
});

// API Routes
app.use('/api/words', wordRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

// Auth routes with username/password login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const result = localStore.authenticateUser(username, password);

  if (result.success) {
    res.json({
      success: true,
      sessionToken: result.sessionToken,
      user: {
        _id: result.user.id,
        displayName: result.user.displayName,
        username: result.user.username,
        isAuthenticated: true
      }
    });
  } else {
    res.status(401).json({ success: false, message: result.message });
  }
});

app.get('/api/auth/user', (req, res) => {
  const sessionToken = req.headers['x-session-token'];

  if (sessionToken) {
    const session = localStore.getUserBySession(sessionToken);
    if (session) {
      return res.json({
        _id: session.userId,
        displayName: session.displayName,
        username: session.username,
        isAuthenticated: true
      });
    }
  }

  res.json({ isAuthenticated: false });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionToken = req.headers['x-session-token'];
  if (sessionToken) {
    localStore.logoutUser(sessionToken);
  }
  res.json({ message: 'Logged out' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
