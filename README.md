# SAT Vocabulary Quiz App

A vocabulary quiz and flashcard application for SAT preparation with 1,112+ words.

## Features

- **Quiz Mode**: Multiple choice questions with instant feedback
- **Flashcard Mode**: Study words with flip cards
- **Filter by Letter**: Focus on specific letters (A-Z)
- **Progress Tracking**: Track your learning progress
- **1,112 SAT Words**: Comprehensive vocabulary list included

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/ramgentle/sat-vocab-quiz.git
cd sat-vocab-quiz

# Start the server (Terminal 1)
cd server
npm install
node server.js

# Start the client (Terminal 2)
cd client
npm install
npm run dev
```

### Open the App
Go to **http://localhost:5173** in your browser

## Import Your Own Words

You can import custom vocabulary from an Excel file:

### Excel Format

Create an Excel file (.xlsx) with these columns:

| word | definition | partOfSpeech | sentences |
|------|------------|--------------|-----------|
| abase | to lower in rank or esteem | verb | He refused to abase himself. |
| abate | to reduce in intensity | verb | The storm began to abate. |

- **word**: The vocabulary word (required)
- **definition**: The word's definition (required)
- **partOfSpeech**: noun, verb, adjective, adverb, etc.
- **sentences**: Example sentences (optional, separate multiple with `|`)

### Import Command

```bash
cd server
node scripts/importFromExcel.js path/to/your/words.xlsx
```

After importing, restart the server and your new words will be available!

### Share Updated Words

After importing your words:

```bash
git add .
git commit -m "Updated vocabulary words"
git push
```

Other users can get your updates by running:
```bash
git pull
```

## Project Structure

```
sat-vocab-quiz/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── server/          # Express backend
│   ├── data/        # Word JSON files
│   ├── scripts/     # Import scripts
│   ├── controllers/
│   ├── routes/
│   └── package.json
└── README.md
```

## License

MIT
