const fs = require('fs');
const path = require('path');

let words = [];
let users = [];
let quizSessions = new Map();
let userProgress = new Map();
let userSessions = new Map(); // Track logged-in users by session token

function loadUsers() {
  try {
    const usersPath = path.join(__dirname, 'users.json');
    const data = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    users = data.users;
    console.log(`Loaded ${users.length} users`);
  } catch (error) {
    console.error('Error loading users:', error.message);
    users = [];
  }
  return users;
}

function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const sessionToken = `session_${user.id}_${Date.now()}`;
    userSessions.set(sessionToken, {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      loginTime: new Date()
    });
    return { success: true, sessionToken, user: { id: user.id, username: user.username, displayName: user.displayName } };
  }
  return { success: false, message: 'Invalid username or password' };
}

function getUserBySession(sessionToken) {
  return userSessions.get(sessionToken);
}

function logoutUser(sessionToken) {
  userSessions.delete(sessionToken);
}

function loadWords() {
  const dataDir = __dirname;
  const files = ['satWords_part1.json', 'satWords_part2.json', 'satWords_part3.json', 'satWords_part4.json'];

  words = [];
  let idCounter = 1;

  for (const file of files) {
    try {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const wordsWithIds = data.words.map(word => ({
        ...word,
        _id: String(idCounter++)
      }));
      words.push(...wordsWithIds);
    } catch (error) {
      console.error(`Error loading ${file}:`, error.message);
    }
  }

  console.log(`Loaded ${words.length} words from JSON files`);
  return words;
}

function getAllWords() {
  return words;
}

function getWordById(id) {
  return words.find(w => w._id === id);
}

function getWordsByLetter(letter) {
  return words.filter(w => w.startingLetter === letter.toUpperCase());
}

function getRandomWords(count, letter = null) {
  let pool = letter ? getWordsByLetter(letter) : words;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getWordCount(letter = null) {
  if (letter) {
    return getWordsByLetter(letter).length;
  }
  return words.length;
}

function getLetterStats() {
  const stats = {};
  words.forEach(word => {
    const letter = word.startingLetter;
    stats[letter] = (stats[letter] || 0) + 1;
  });
  return Object.entries(stats)
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => a._id.localeCompare(b._id));
}

function createQuizSession(sessionData) {
  const id = String(Date.now());
  const session = {
    _id: id,
    ...sessionData,
    createdAt: new Date(),
    isCompleted: false
  };
  quizSessions.set(id, session);
  return session;
}

function getQuizSession(sessionId) {
  return quizSessions.get(sessionId);
}

function updateQuizSession(sessionId, updates) {
  const session = quizSessions.get(sessionId);
  if (session) {
    Object.assign(session, updates);
    quizSessions.set(sessionId, session);
  }
  return session;
}

function getUserProgress(userId) {
  if (!userProgress.has(userId)) {
    userProgress.set(userId, {
      userId,
      wordsLearned: [],
      statistics: {
        totalQuizzesTaken: 0,
        totalWordsStudied: 0,
        bestScore: 0,
        averageScore: 0,
        lastStudyDate: null
      }
    });
  }
  return userProgress.get(userId);
}

function updateUserProgress(userId, updates) {
  const progress = getUserProgress(userId);
  Object.assign(progress, updates);
  userProgress.set(userId, progress);
  return progress;
}

function getCompletedQuizSessions(userId) {
  return Array.from(quizSessions.values())
    .filter(s => s.userId === userId && s.isCompleted)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

module.exports = {
  loadWords,
  loadUsers,
  authenticateUser,
  getUserBySession,
  logoutUser,
  getAllWords,
  getWordById,
  getWordsByLetter,
  getRandomWords,
  getWordCount,
  getLetterStats,
  createQuizSession,
  getQuizSession,
  updateQuizSession,
  getUserProgress,
  updateUserProgress,
  getCompletedQuizSessions
};
