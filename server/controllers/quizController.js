const localStore = require('../data/localStore');
const { shuffleArray } = require('../utils/shuffle');

const startQuiz = async (req, res) => {
  try {
    const { wordCount, letterFilter, mode = 'quiz' } = req.body;
    const userId = req.user?._id || 'local-user';

    const validCounts = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    if (!validCounts.includes(wordCount)) {
      return res.status(400).json({ error: 'Invalid word count' });
    }

    const availableWords = letterFilter 
      ? localStore.getWordsByLetter(letterFilter)
      : localStore.getAllWords();

    if (availableWords.length < wordCount) {
      return res.status(400).json({
        error: `Not enough words available. Found ${availableWords.length}, need ${wordCount}`
      });
    }

    const shuffledWords = shuffleArray(availableWords);
    const selectedWords = shuffledWords.slice(0, wordCount);

    const questions = selectedWords.map((correctWord, index) => {
      const wrongOptions = shuffledWords
        .filter(w => w._id !== correctWord._id)
        .slice(0, 3);

      const allOptions = shuffleArray([
        { word: correctWord.word, isCorrect: true },
        ...wrongOptions.map(w => ({ word: w.word, isCorrect: false }))
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
      wordCount,
      letterFilter: letterFilter?.toUpperCase() || null,
      words: selectedWords.map(w => ({ wordId: w._id, word: w }))
    });

    res.json({
      sessionId: session._id,
      questions,
      totalQuestions: wordCount
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
