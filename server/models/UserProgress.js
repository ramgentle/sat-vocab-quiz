const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  wordsLearned: [{
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    },
    timesCorrect: { type: Number, default: 0 },
    timesIncorrect: { type: Number, default: 0 },
    lastPracticed: { type: Date },
    masteryLevel: {
      type: String,
      enum: ['new', 'learning', 'familiar', 'mastered'],
      default: 'new'
    }
  }],
  statistics: {
    totalQuizzesTaken: { type: Number, default: 0 },
    totalFlashcardSessions: { type: Number, default: 0 },
    totalWordsStudied: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date }
  }
}, {
  timestamps: true
});

userProgressSchema.index({ userId: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
