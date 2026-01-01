const localStore = require('../data/localStore');
const { shuffleArray } = require('../utils/shuffle');

const startQuiz = async (req, res) => {
  try {
    const { wordCount, letterFilter, complexityFilter, mode = 'quiz' } = req.body;
    const userId = req.user?._id || 'local-user';

    // Validate word count - must be positive integer
    if (!wordCount || wordCount < 1 || !Number.isInteger(wordCount)) {
      return res.status(400).json({ error: 'Invalid word count' });
    }

    // Get words filtered by letter and complexity
    const availableWords = localStore.getWordsFiltered(letterFilter, complexityFilter);

    // Use the minimum of requested count and available words
    const actualWordCount = Math.min(wordCount, availableWords.length);

    if (actualWordCount < 4) {
      return res.status(400).json({
        error: `Need at least 4 words for quiz options. Found ${availableWords.length}`
      });
    }

    const shuffledWords = shuffleArray(availableWords);
    const selectedWords = shuffledWords.slice(0, actualWordCount);

    const questions = selectedWords.map((correctWord, index) => {
      // Get all words except the correct one, then shuffle and pick 3 random wrong options
      const otherWords = availableWords.filter(w => w._id !== correctWord._id);
      const randomWrongOptions = shuffleArray(otherWords).slice(0, 3);

      const allOptions = shuffleArray([
        { word: correctWord.word, isCorrect: true },
        ...randomWrongOptions.map(w => ({ word: w.word, isCorrect: false }))
      ]);

      return {
        questionNumber: index + 1,
        wordId: correctWord._id,
        definition: correctWord.definition,
        partOfSpeech: correctWord.partOfSpeech,
        options: allOptions.map(opt => opt.word),
        correctAnswer: correctWord.word
      };
    });

    const session = localStore.createQuizSession({
      userId,
      mode,
      wordCount: actualWordCount,
      letterFilter: letterFilter?.toUpperCase() || null,
      complexityFilter: complexityFilter || null,
      words: selectedWords.map(w => ({ wordId: w._id, word: w }))
    });

    res.json({
      sessionId: session._id,
      questions,
      totalQuestions: actualWordCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizSession = async (req, res) => {
  try {
    const session = localStore.getQuizSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Quiz session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeQuiz = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;

    const session = localStore.getQuizSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Quiz session not found' });
    }

    if (session.isCompleted) {
      return res.status(400).json({ error: 'Quiz already completed' });
    }

    let correct = 0;
    let incorrect = 0;
    const reviewData = [];

    session.words.forEach((wordEntry) => {
      const wordIdStr = wordEntry.wordId;
      const userAnswer = answers[wordIdStr];
      const isCorrect = userAnswer === wordEntry.word.word;

      if (isCorrect) {
        correct++;
      } else {
        incorrect++;
      }

      wordEntry.userAnswer = userAnswer;
      wordEntry.isCorrect = isCorrect;

      reviewData.push({
        word: wordEntry.word.word,
        definition: wordEntry.word.definition,
        partOfSpeech: wordEntry.word.partOfSpeech,
        sentences: wordEntry.word.sentences,
        userAnswer: userAnswer || 'No answer',
        correctAnswer: wordEntry.word.word,
        isCorrect
      });
    });

    const percentage = Math.round((correct / session.words.length) * 100);

    localStore.updateQuizSession(sessionId, {
      score: { correct, incorrect, percentage },
      completedAt: new Date(),
      isCompleted: true
    });

    // Update user progress statistics
    const userId = session.userId;
    const progress = localStore.getUserProgress(userId);
    const stats = progress.statistics;

    stats.totalQuizzesTaken = (stats.totalQuizzesTaken || 0) + 1;
    stats.totalWordsStudied = (stats.totalWordsStudied || 0) + session.words.length;
    stats.bestScore = Math.max(stats.bestScore || 0, percentage);
    stats.lastStudyDate = new Date();

    // Calculate new average
    const totalScores = (stats.averageScore || 0) * (stats.totalQuizzesTaken - 1) + percentage;
    stats.averageScore = Math.round(totalScores / stats.totalQuizzesTaken);

    localStore.updateUserProgress(userId, { statistics: stats });

    res.json({
      score: { correct, incorrect, percentage },
      totalQuestions: session.words.length,
      reviewData,
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user?._id || 'local-user';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allSessions = localStore.getCompletedQuizSessions(userId);
    const sessions = allSessions.slice(skip, skip + limit);
    const total = allSessions.length;

    res.json({
      sessions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSessions: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  startQuiz,
  getQuizSession,
  completeQuiz,
  getQuizHistory
};
