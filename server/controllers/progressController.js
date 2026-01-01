const localStore = require('../data/localStore');

const getProgress = async (req, res) => {
  try {
    const userId = req.user?._id || 'local-user';
    const progress = localStore.getUserProgress(userId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const userId = req.user?._id || 'local-user';
    const progress = localStore.getUserProgress(userId);
    res.json(progress.statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWordsLearned = async (req, res) => {
  try {
    const userId = req.user?._id || 'local-user';
    const progress = localStore.getUserProgress(userId);

    const words = progress.wordsLearned.map(w => {
      const word = localStore.getWordById(w.wordId);
      return {
        word: word?.word || 'Unknown',
        definition: word?.definition || '',
        partOfSpeech: word?.partOfSpeech || '',
        startingLetter: word?.startingLetter || '',
        timesCorrect: w.timesCorrect,
        timesIncorrect: w.timesIncorrect,
        masteryLevel: w.masteryLevel,
        lastPracticed: w.lastPracticed
      };
    });

    res.json({
      words,
      total: words.length,
      masteryBreakdown: {
        new: words.filter(w => w.masteryLevel === 'new').length,
        learning: words.filter(w => w.masteryLevel === 'learning').length,
        familiar: words.filter(w => w.masteryLevel === 'familiar').length,
        mastered: words.filter(w => w.masteryLevel === 'mastered').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProgressByLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const userId = req.user?._id || 'local-user';

    const totalWords = localStore.getWordCount(letter);
    const progress = localStore.getUserProgress(userId);

    const learnedForLetter = progress.wordsLearned.filter(w => {
      const word = localStore.getWordById(w.wordId);
      return word && word.startingLetter === letter;
    }).length;

    res.json({
      letter,
      totalWords,
      wordsLearned: learnedForLetter,
      percentage: totalWords > 0 ? Math.round((learnedForLetter / totalWords) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLettersProgress = async (req, res) => {
  try {
    const userId = req.user?._id || 'local-user';
    const letterStats = localStore.getLetterStats();
    const progress = localStore.getUserProgress(userId);

    const letterProgress = letterStats.map(lc => {
      const learned = progress.wordsLearned.filter(w => {
        const word = localStore.getWordById(w.wordId);
        return word && word.startingLetter === lc._id;
      }).length;

      return {
        letter: lc._id,
        total: lc.count,
        learned,
        percentage: Math.round((learned / lc.count) * 100)
      };
    });

    res.json(letterProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProgress,
  getStatistics,
  getWordsLearned,
  getProgressByLetter,
  getAllLettersProgress
};
