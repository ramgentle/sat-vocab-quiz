const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  getProgress,
  getStatistics,
  getWordsLearned,
  getProgressByLetter,
  getAllLettersProgress
} = require('../controllers/progressController');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getProgress);
router.get('/statistics', getStatistics);
router.get('/words', getWordsLearned);
router.get('/letters', getAllLettersProgress);
router.get('/letter/:letter', getProgressByLetter);

module.exports = router;
