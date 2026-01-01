# SAT Vocabulary Quiz App - Documentation

## Overview

**App Name:** SAT Vocabulary Quiz
**Purpose:** A web application to help students practice SAT vocabulary words through interactive quizzes and flashcards.
**Total Words:** 884 SAT vocabulary words
**Users:** 2 configured users (username/password authentication)

---

## Hosting & URLs

### Production URLs
| Service | URL | Platform |
|---------|-----|----------|
| Frontend | https://sat-vocab-quiz.vercel.app | Vercel |
| Backend API | https://sat-vocab-api.onrender.com | Render |

### Repository
- **GitHub:** https://github.com/ramgentle/sat-vocab-quiz

### Deployment
Both platforms auto-deploy when changes are pushed to the `main` branch:
- **Vercel:** Monitors the `client` folder for frontend changes
- **Render:** Monitors the `server` folder for backend changes

---

## Project Structure

```
SAT English Words Trivia/
├── client/                    # React Frontend (Vite)
│   ├── public/
│   │   ├── icons/            # App icons
│   │   ├── manifest.json     # PWA manifest
│   │   └── sw.js             # Service worker
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   └── services/         # API service layer
│   └── .env                  # Environment variables (API URL)
│
├── server/                    # Express.js Backend
│   ├── controllers/          # Route handlers
│   ├── data/                 # JSON word files & local store
│   │   ├── localStore.js     # In-memory data store
│   │   ├── users.json        # User credentials
│   │   ├── satWords_part1.json
│   │   ├── satWords_part2.json
│   │   ├── satWords_part3.json
│   │   └── satWords_part4.json
│   ├── routes/               # API route definitions
│   ├── scripts/              # Utility scripts
│   │   └── importFromExcel.js
│   └── utils/                # Helper functions
│
└── APP_DOCUMENTATION.md      # This file
```

---

## Technical Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** CSS (custom)
- **HTTP Client:** Axios
- **PWA:** Enabled (installable on mobile devices)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** None (in-memory JSON storage)
- **Authentication:** Session-based (username/password)

---

## User Accounts

Users are configured in `server/data/users.json`:

```json
{
  "users": [
    {
      "id": "user1",
      "username": "username1",
      "password": "password1",
      "displayName": "User One"
    },
    {
      "id": "user2",
      "username": "username2",
      "password": "password2",
      "displayName": "User Two"
    }
  ]
}
```

To add/modify users, edit this file and redeploy.

---

## How to Add New Words

### Method 1: Edit JSON Files Directly

Word files are located in `server/data/`. Add words to any `satWords_partX.json` file:

```json
{
  "word": "example",
  "definition": "a thing characteristic of its kind",
  "partOfSpeech": "n.",
  "sentences": [
    "This is an example sentence.",
    "Here is another example."
  ],
  "startingLetter": "E",
  "complexity": "medium"
}
```

**Field Reference:**
| Field | Description | Values |
|-------|-------------|--------|
| word | The vocabulary word (lowercase) | string |
| definition | Word meaning | string |
| partOfSpeech | Part of speech | "n.", "v.", "adj.", "adv." |
| sentences | Example sentences (array) | string[] |
| startingLetter | First letter (uppercase) | A-Z |
| complexity | Difficulty level | "simple", "medium", "high" |

### Method 2: Import from Excel

1. Create an Excel file with columns:
   - Column A: word
   - Column B: definition
   - Column C: partOfSpeech (noun, verb, adjective, adverb)
   - Column D: sentences (optional, separate with |)
   - Column E: complexity (optional: simple, medium, high)

2. Run the import script:
   ```bash
   cd server
   node scripts/importFromExcel.js path/to/your/file.xlsx
   ```

3. Commit and push changes:
   ```bash
   git add server/data/
   git commit -m "Add new vocabulary words"
   git push
   ```

---

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ramgentle/sat-vocab-quiz.git
   cd sat-vocab-quiz
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Configure environment:**

   Create `client/.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev   # or: node server.js

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login with username/password |
| POST | /api/auth/logout | Logout current user |

### Words
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/words | Get all words (paginated) |
| GET | /api/words/count | Get total word count |
| GET | /api/words/stats/letters | Get word count by letter |
| GET | /api/words/stats/complexity | Get word count by complexity |
| GET | /api/words/letter/:letter | Get words by starting letter |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/quiz/start | Start a new quiz |
| GET | /api/quiz/:sessionId | Get quiz session |
| POST | /api/quiz/:sessionId/complete | Submit quiz answers |
| GET | /api/quiz/history | Get user's quiz history |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/progress | Get user's progress stats |

---

## Features

### Quiz Mode
- Select number of words: 10, 20, 30... 100, or All
- Filter by starting letter (A-Z)
- Filter by difficulty level (Simple, Medium, High)
- Multiple choice questions (4 options)
- Immediate feedback on answers
- Review all answers after completion
- Progress tracking

### Flashcard Mode
- Browse vocabulary words as flashcards
- Flip cards to see definitions
- Navigate between cards

### Dashboard
- View quiz history
- Track statistics (quizzes taken, best score, etc.)
- See learning progress

### PWA (Progressive Web App)
- Install on iPhone/Android from browser
- Works offline (cached resources)
- Native app-like experience

---

## Deployment Configuration

### Vercel (Frontend)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Root Directory:** `client`

### Render (Backend)
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Root Directory:** `server`
- **Environment Variables:**
  - `NODE_ENV=production`
  - `PORT=5000` (optional, Render provides this)

---

## Troubleshooting

### "Failed to fetch" errors
- Check if backend is running on Render
- Verify `VITE_API_URL` in client/.env points to correct backend URL
- Check CORS settings in server.js

### Words not loading
- Ensure JSON files in server/data/ are valid JSON
- Check server logs for parsing errors
- Verify file names match what's listed in localStore.js

### Quiz options repeating
- This was fixed - options are now randomized per question
- If issue persists, clear browser cache and reload

### PWA not installing
- Ensure you're on HTTPS (production)
- Check manifest.json is valid
- Verify service worker is registered

---

## Maintenance Tasks

### Regular Updates
1. Add new vocabulary words periodically
2. Review and update example sentences
3. Adjust complexity levels based on user feedback

### Monitoring
- Check Render dashboard for backend health
- Monitor Vercel analytics for frontend performance
- Review error logs periodically

### Backups
- Word data is in JSON files (version controlled in Git)
- User progress is in-memory (resets on server restart)
- Consider adding persistent storage for production use

---

## Future Enhancements (Ideas)

- [ ] Add more vocabulary words
- [ ] Implement spaced repetition algorithm
- [ ] Add pronunciation audio
- [ ] Create word categories/themes
- [ ] Add user registration (currently hardcoded users)
- [ ] Implement persistent database (MongoDB/PostgreSQL)
- [ ] Add leaderboards
- [ ] Export progress to PDF

---

## Contact & Support

For issues or questions, create an issue on GitHub:
https://github.com/ramgentle/sat-vocab-quiz/issues

---

*Last Updated: January 2026*
