const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  definition: {
    type: String,
    required: true
  },
  partOfSpeech: {
    type: String,
    required: true,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun']
  },
  sentences: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length >= 1 && arr.length <= 2;
      },
      message: 'Each word should have 1-2 example sentences'
    },
    required: true
  },
  startingLetter: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 1,
    index: true
  }
}, {
  timestamps: true
});

wordSchema.index({ startingLetter: 1, word: 1 });

module.exports = mongoose.model('Word', wordSchema);
