const localStore = require('../data/localStore');

const getAllWords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const allWords = localStore.getAllWords();
    const words = allWords.slice(skip, skip + limit);
    const total = allWords.length;

    res.json({
      words,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWords: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWordById = async (req, res) => {
  try {
    const word = localStore.getWordById(req.params.id);
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWordsByLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const words = localStore.getWordsByLetter(letter);
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomWords = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const letter = req.query.letter?.toUpperCase();

    const totalAvailable = localStore.getWordCount(letter);

    if (totalAvailable < count) {
      return res.status(400).json({
        error: `Not enough words available. Found ${totalAvailable}, requested ${count}`
      });
    }

    const words = localStore.getRandomWords(count, letter);
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWordCount = async (req, res) => {
  try {
    const total = localStore.getWordCount();
    res.json({ count: total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWordCountByLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const count = localStore.getWordCount(letter);
    res.json({ letter, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLetterStats = async (req, res) => {
  try {
    const stats = localStore.getLetterStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllWords,
  getWordById,
  getWordsByLetter,
  getRandomWords,
  getWordCount,
  getWordCountByLetter,
  getLetterStats
};
