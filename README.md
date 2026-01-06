# Stepwyse - Daily Word Association Game

A daily word puzzle where you build semantic chains between two words by finding creative connections.

## About

Stepwyse challenges you to connect two seemingly unrelated words by building a chain of semantically related words. Each connection must be justified, encouraging creative thinking and deep vocabulary exploration.

**Game Concept:** Semantic Chains (based on peer-reviewed research showing cognitive benefits)

## Features

- ✨ Daily puzzle with same words for everyone
- 🧠 Requires creative semantic connections
- 📊 Statistics tracking (streaks, average steps)
- 📱 Fully responsive design
- 💾 Progress saved locally
- 🔗 Shareable results (no spoilers)
- ♿ Keyboard accessible

## How to Play

1. Connect the **start word** to the **target word**
2. Each new word must be semantically related to the previous word
3. Justify each connection (3-60 characters)
4. Shorter chains score higher creativity points

## Files

- `index.html` - Main game interface
- `styles.css` - NYT-inspired minimalist design
- `game.js` - Game logic and state management

## Deployment Instructions

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all three files (index.html, styles.css, game.js)
3. Go to repository Settings → Pages
4. Select "main" branch and "/" root
5. Click Save
6. Your game will be live at `https://yourusername.github.io/stepwyse`

### Option 2: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to your project folder
3. Run: `vercel`
4. Follow prompts to deploy
5. Your game will be live at a Vercel URL

### Option 3: Netlify

1. Drag and drop the folder into Netlify.com
2. Or connect your GitHub repository
3. Deploy automatically

## Local Testing

Simply open `index.html` in a web browser. No build process required!

## Future Enhancements

- Real dictionary API for word validation
- More sophisticated semantic validation
- User accounts and global leaderboards
- Puzzle archive for premium subscribers
- Dark mode
- Accessibility improvements
- Multiple difficulty levels
- Hints system

## Technical Notes

**Current Limitations:**
- Word dictionary is limited (accepts any 3+ letter word or words in basic dictionary)
- No actual semantic similarity checking (relies on user honesty)
- Daily puzzles rotate through 15 pairs (will expand)

**For Production:**
- Implement real dictionary API (Datamuse, Wordnik, etc.)
- Add semantic similarity checking (Word2Vec, BERT embeddings)
- Expand puzzle database to 365+ unique pairs
- Add proper analytics (Plausible or Simple Analytics)
- Implement CDN for better performance
- Add proper error tracking

## Design Principles

Following NYT Games aesthetic:
- Editorial typography (Spectral serif + system sans)
- Minimalist black/white/gray palette
- Generous spacing
- No dark patterns
- No ads or manipulative mechanics
- One puzzle per day (enforced scarcity)
- Shareable results without spoilers

## Target Metrics

- 70%+ completion rate
- 30%+ share rate
- 40%+ next-day return rate
- 2-4 minute average session time
- Viral coefficient (K) > 1.0

## License

All rights reserved. This is a prototype for testing and iteration.

## Next Steps

1. Test with 3-5 friends
2. Collect feedback on difficulty and UX
3. Iterate on word validation
4. Expand puzzle database
5. Add proper dictionary API
6. Deploy to production
7. Soft launch to beta testers
8. Launch on Product Hunt

## Contact

Built with ❤️ for the daily puzzle community.

Target launch: March 1, 2026
