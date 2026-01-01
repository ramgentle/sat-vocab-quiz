const mongoose = require('mongoose');

const quizSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mode: {
    type: String,
    enum: ['quiz', 'flashcard'],
    required: true
  },
  wordCount: {
    type: Number,
    required: true,
    enum: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  },
  letterFilter: {
    type: String,
    uppercase: true,
    default: null
  },
  words: [{
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    },
    userAnswer: String,
    isCorrect: Boolean,
    wasRevealed: Boolean
  }],
  score: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

quizSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('QuizSession', quizSessionSchema);
