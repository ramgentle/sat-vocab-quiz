require('dotenv').config();
const express = require('express');
const cors = require('cors');
const localStore = require('./data/localStore');

const wordRoutes = require('./routes/wordRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// Load words from JSON files
localStore.loadWords();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/words', wordRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);

// Auth routes - simplified for local dev
app.get('/api/auth/user', (req, res) => {
  res.json({
    _id: 'local-user',
    displayName: 'Local User',
    email: 'local@test.com',
    isAuthenticated: true
  });
});

app.get('/api/auth/logout', (req, res) => {
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
