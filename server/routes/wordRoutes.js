const express = require('express');
const {
  getAllWords,
  getWordById,
  getWordsByLetter,
  getRandomWords,
  getWordCount,
  getWordCountByLetter,
  getLetterStats
} = require('../controllers/wordController');

const router = express.Router();

router.get('/', getAllWords);
router.get('/random', getRandomWords);
router.get('/count', getWordCount);
router.get('/stats/letters', getLetterStats);
router.get('/letter/:letter', getWordsByLetter);
router.get('/count/:letter', getWordCountByLetter);
router.get('/:id', getWordById);

module.exports = router;
