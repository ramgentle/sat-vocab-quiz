const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  startQuiz,
  getQuizSession,
  completeQuiz,
  getQuizHistory
} = require('../controllers/quizController');

const router = express.Router();

router.use(isAuthenticated);

router.post('/start', startQuiz);
router.get('/history', getQuizHistory);
router.get('/:sessionId', getQuizSession);
router.post('/:sessionId/complete', completeQuiz);

module.exports = router;
