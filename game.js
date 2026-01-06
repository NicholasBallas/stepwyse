// Stepwyse Game Logic

// Game State
let gameState = {
    startWord: '',
    targetWord: '',
    chain: [],
    isComplete: false,
    hasGivenUp: false
};

// Daily puzzle pairs (seed-based for consistency)
const puzzlePairs = [
    { start: 'OCEAN', target: 'MUSIC' },
    { start: 'TREE', target: 'COMPUTER' },
    { start: 'FIRE', target: 'BOOK' },
    { start: 'MOON', target: 'COFFEE' },
    { start: 'MOUNTAIN', target: 'SMILE' },
    { start: 'RIVER', target: 'DREAM' },
    { start: 'STORM', target: 'PAINT' },
    { start: 'SUN', target: 'WINTER' },
    { start: 'FLOWER', target: 'TIME' },
    { start: 'BRIDGE', target: 'DANCE' },
    { start: 'CASTLE', target: 'STAR' },
    { start: 'GARDEN', target: 'SONG' },
    { start: 'CLOUD', target: 'MEMORY' },
    { start: 'WIND', target: 'STORY' },
    { start: 'STONE', target: 'HEART' }
];

// Simple word dictionary for validation (in production, would use a real API)
const commonWords = new Set([
    'ocean', 'water', 'blue', 'wave', 'sea', 'lake', 'sound', 'music', 'song', 'rhythm',
    'tree', 'wood', 'forest', 'green', 'leaf', 'paper', 'computer', 'digital', 'data',
    'fire', 'heat', 'warm', 'light', 'read', 'book', 'page', 'story', 'write',
    'moon', 'night', 'dark', 'sleep', 'wake', 'morning', 'drink', 'coffee', 'cup',
    'mountain', 'high', 'peak', 'top', 'happy', 'joy', 'smile', 'face', 'expression',
    'river', 'flow', 'stream', 'water', 'thought', 'mind', 'dream', 'sleep', 'imagine',
    'storm', 'rain', 'cloud', 'gray', 'color', 'art', 'paint', 'brush', 'canvas',
    'sun', 'summer', 'hot', 'cold', 'ice', 'snow', 'winter', 'season', 'year',
    'flower', 'bloom', 'grow', 'change', 'transform', 'time', 'clock', 'hour',
    'bridge', 'connect', 'link', 'join', 'together', 'group', 'people', 'dance', 'move',
    'castle', 'old', 'ancient', 'past', 'history', 'space', 'sky', 'star', 'bright',
    'garden', 'plant', 'grow', 'sing', 'voice', 'sound', 'song', 'music', 'melody',
    'cloud', 'soft', 'gentle', 'remember', 'think', 'memory', 'past', 'recall',
    'wind', 'air', 'breath', 'speak', 'tell', 'talk', 'story', 'tale', 'narrative',
    'stone', 'hard', 'solid', 'strong', 'love', 'emotion', 'heart', 'feel', 'feeling',
    'mirror', 'reflect', 'image', 'see', 'look', 'view', 'soap', 'clean', 'wash',
    'bird', 'fly', 'air', 'freedom', 'free', 'liberty', 'peace', 'calm', 'quiet',
    'road', 'path', 'way', 'journey', 'travel', 'trip', 'vacation', 'rest', 'relax',
    'door', 'open', 'close', 'enter', 'exit', 'leave', 'go', 'come', 'arrive'
]);

// Initialize game
function initGame() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const puzzleIndex = dayOfYear % puzzlePairs.length;
    const puzzle = puzzlePairs[puzzleIndex];
    
    gameState.startWord = puzzle.start;
    gameState.targetWord = puzzle.target;
    gameState.chain = [{ word: puzzle.start, connection: null }];
    
    // Check if already completed today
    const savedState = loadGameState();
    if (savedState && savedState.date === getTodayString() && savedState.isComplete) {
        gameState = savedState;
        showResults();
        return;
    }
    
    updateUI();
    setupEventListeners();
    updateCountdown();
}

// UI Updates
function updateUI() {
    document.getElementById('dateDisplay').textContent = formatDate(new Date());
    document.getElementById('startWord').textContent = gameState.startWord;
    document.getElementById('targetWord').textContent = gameState.targetWord;
    document.getElementById('displayStartWord').textContent = gameState.startWord;
    document.getElementById('currentWord').textContent = getCurrentWord();
    
    // Check if tutorial should be hidden
    if (localStorage.getItem('stepwyse-tutorial-dismissed') === 'true') {
        document.getElementById('tutorialBox').classList.add('hidden');
    }
    
    renderChain();
}

function renderChain() {
    const container = document.getElementById('chainContainer');
    const startItem = document.querySelector('.start-word');
    
    // Clear existing items except start
    const existingItems = container.querySelectorAll('.chain-item:not(.start-word)');
    existingItems.forEach(item => item.remove());
    
    // Render chain items (skip first as it's the start word)
    for (let i = 1; i < gameState.chain.length; i++) {
        const item = gameState.chain[i];
        
        // Create connection element
        if (item.connection) {
            const connectionDiv = document.createElement('div');
            connectionDiv.className = 'connection';
            connectionDiv.textContent = item.connection;
            container.appendChild(connectionDiv);
        }
        
        // Create word element
        const chainItem = document.createElement('div');
        chainItem.className = 'chain-item';
        if (item.word.toUpperCase() === gameState.targetWord) {
            chainItem.classList.add('target-reached');
        }
        
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.textContent = item.word;
        
        chainItem.appendChild(wordSpan);
        container.appendChild(chainItem);
    }
}

function getCurrentWord() {
    return gameState.chain[gameState.chain.length - 1].word;
}

// Event Listeners
function setupEventListeners() {
    // Tutorial dismiss
    document.getElementById('dismissTutorial').addEventListener('click', () => {
        document.getElementById('tutorialBox').classList.add('hidden');
        localStorage.setItem('stepwyse-tutorial-dismissed', 'true');
    });
    
    // Word submission
    document.getElementById('submitBtn').addEventListener('click', handleWordSubmit);
    document.getElementById('wordInput').addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') await handleWordSubmit();
    });
    
    // Connection submission
    document.getElementById('submitConnection').addEventListener('click', handleConnectionSubmit);
    document.getElementById('cancelConnection').addEventListener('click', cancelConnection);
    document.getElementById('connectionText').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConnectionSubmit();
    });
    
    // Give up
    document.getElementById('giveUpBtn').addEventListener('click', handleGiveUp);
    
    // Modals
    document.getElementById('howToPlayBtn').addEventListener('click', () => {
        document.getElementById('howToPlayModal').classList.add('active');
    });
    document.getElementById('closeHowToPlay').addEventListener('click', () => {
        document.getElementById('howToPlayModal').classList.remove('active');
    });
    
    document.getElementById('statsBtn').addEventListener('click', () => {
        updateStatsDisplay();
        document.getElementById('statsModal').classList.add('active');
    });
    document.getElementById('closeStats').addEventListener('click', () => {
        document.getElementById('statsModal').classList.remove('active');
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Share button
    document.getElementById('shareBtn').addEventListener('click', shareResults);
    
    // View chain button
    document.getElementById('viewChainBtn').addEventListener('click', () => {
        document.getElementById('resultsScreen').style.display = 'none';
    });
}

// Word Submission
let pendingWord = '';

async function handleWordSubmit() {
    const input = document.getElementById('wordInput');
    const submitBtn = document.getElementById('submitBtn');
    const word = input.value.trim().toLowerCase();
    
    if (!word) return;
    
    // Prevent double-submission
    if (isValidating) return;
    
    // Basic validation
    if (!isValidWord(word)) {
        alert('Please enter a valid English word (at least 3 letters).');
        return;
    }
    
    // Check if word is already in chain
    if (gameState.chain.some(item => item.word.toLowerCase() === word)) {
        alert('You\'ve already used that word in your chain.');
        return;
    }
    
    // Show loading state
    isValidating = true;
    submitBtn.textContent = 'Checking...';
    submitBtn.disabled = true;
    input.disabled = true;
    
    try {
        // Validate semantic connection to previous word
        const previousWord = getCurrentWord().toLowerCase();
        const isRelated = await validateSemanticConnection(previousWord, word);
        
        if (!isRelated) {
            // Just inform user but allow them to proceed
            const message = `Tip: "${word.toUpperCase()}" might not be strongly related to "${getCurrentWord()}". ` +
                          `But if you have a creative connection, go for it!`;
            
            // Show as gentle notification, not a blocker
            const hintElement = document.getElementById('hintText');
            const originalText = hintElement.innerHTML;
            hintElement.innerHTML = `<span style="color: #b59f3b;">⚠️ ${message}</span>`;
            
            // Reset hint after showing connection
            setTimeout(() => {
                hintElement.innerHTML = originalText;
            }, 5000);
        }
        
        // Always allow the word to proceed
        pendingWord = word.toUpperCase();
        input.value = '';
        showConnectionInput();
        
    } catch (error) {
        console.error('Validation error:', error);
        // Always allow on error
        pendingWord = word.toUpperCase();
        input.value = '';
        showConnectionInput();
    } finally {
        // Reset button state
        isValidating = false;
        submitBtn.textContent = 'Add';
        submitBtn.disabled = false;
        input.disabled = false;
    }
}

function showConnectionInput() {
    const prevWord = getCurrentWord();
    document.getElementById('prevWord').textContent = prevWord;
    document.getElementById('newWord').textContent = pendingWord;
    document.getElementById('connectionInput').style.display = 'block';
    document.getElementById('connectionText').focus();
}

function handleConnectionSubmit() {
    const connectionText = document.getElementById('connectionText').value.trim();
    
    if (connectionText.length < 3) {
        alert('Please provide a connection explanation (at least 3 characters).');
        return;
    }
    
    // Add to chain
    gameState.chain.push({
        word: pendingWord,
        connection: connectionText
    });
    
    // Check if target reached
    if (pendingWord === gameState.targetWord) {
        gameState.isComplete = true;
        saveGameState();
        showResults();
        return;
    }
    
    // Reset connection input
    document.getElementById('connectionText').value = '';
    document.getElementById('connectionInput').style.display = 'none';
    pendingWord = '';
    
    updateUI();
}

function cancelConnection() {
    pendingWord = '';
    document.getElementById('connectionText').value = '';
    document.getElementById('connectionInput').style.display = 'none';
}

// Validation
let isValidating = false;

async function isValidWord(word) {
    // Basic validation first - must be 3+ letters
    if (word.length < 3) {
        return false;
    }
    
    // Check if it's in our basic dictionary
    if (commonWords.has(word.toLowerCase())) {
        return true;
    }
    
    // For words not in basic dictionary, accept if 3+ letters
    // (we'll validate semantic relationship separately)
    return true;
}

async function validateSemanticConnection(word1, word2) {
    // Use Datamuse API to check if word2 is related to word1
    try {
        // Try multiple relationship types for better coverage
        const endpoints = [
            `https://api.datamuse.com/words?rel_jja=${word1}&max=100`,  // Popular nouns modified by word1
            `https://api.datamuse.com/words?rel_trg=${word1}&max=100`,  // Words triggered by word1
            `https://api.datamuse.com/words?rel_jjb=${word1}&max=100`,  // Popular adjectives to describe word1
            `https://api.datamuse.com/words?ml=${word1}&max=100`,       // Means like
            `https://api.datamuse.com/words?rel_syn=${word1}&max=100`,  // Synonyms
        ];
        
        // Check all endpoints in parallel
        const results = await Promise.all(
            endpoints.map(url => 
                fetch(url)
                    .then(r => r.json())
                    .catch(err => {
                        console.log('Endpoint failed:', url, err);
                        return [];
                    })
            )
        );
        
        // Flatten all results
        const allWords = results.flat();
        
        console.log(`Checking if "${word2}" is related to "${word1}"`);
        console.log(`Found ${allWords.length} related words:`, allWords.slice(0, 10).map(w => w.word));
        
        // Check if word2 appears in any of the related words
        const word2Lower = word2.toLowerCase();
        const isRelated = allWords.some(item => 
            item.word && item.word.toLowerCase() === word2Lower
        );
        
        console.log(`Result: ${isRelated ? 'RELATED' : 'NOT FOUND'}`);
        
        return isRelated;
    } catch (error) {
        console.error('Validation error:', error);
        // If API fails, allow the word (fail open, not closed)
        return true;
    }
}

// Give Up
function handleGiveUp() {
    if (!confirm('Are you sure you want to give up?')) return;
    
    gameState.hasGivenUp = true;
    gameState.isComplete = true;
    saveGameState();
    showResults();
}

// Results
function showResults() {
    const resultsScreen = document.getElementById('resultsScreen');
    const resultsChain = document.getElementById('resultsChain');
    const resultsTitle = document.getElementById('resultsTitle');
    
    // Set title
    if (gameState.hasGivenUp) {
        resultsTitle.textContent = 'Maybe tomorrow!';
    } else {
        resultsTitle.textContent = 'You did it!';
    }
    
    // Calculate stats
    const chainLength = gameState.chain.length - 1; // Subtract start word
    
    document.getElementById('chainLength').textContent = chainLength;
    
    // Render chain
    resultsChain.innerHTML = '';
    gameState.chain.forEach((item, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'results-step';
        
        const wordDiv = document.createElement('div');
        wordDiv.className = 'results-word';
        wordDiv.textContent = item.word;
        
        stepDiv.appendChild(wordDiv);
        
        if (item.connection) {
            const connDiv = document.createElement('div');
            connDiv.className = 'results-connection';
            connDiv.textContent = '↓ ' + item.connection;
            stepDiv.appendChild(connDiv);
        }
        
        resultsChain.appendChild(stepDiv);
    });
    
    resultsScreen.style.display = 'flex';
    
    // Update global stats
    updateGlobalStats();
}

function calculateCreativity() {
    // Simple creativity score based on chain length and connection quality
    // Shorter chains = higher creativity
    const chainLength = gameState.chain.length - 1;
    
    if (gameState.hasGivenUp) return 0;
    
    let score = 10;
    if (chainLength > 5) score -= (chainLength - 5);
    if (chainLength > 10) score -= (chainLength - 10);
    
    return Math.max(1, Math.min(10, score));
}

// Share Results
function shareResults() {
    const chainLength = gameState.chain.length - 1;
    
    // Create shareable text
    const shareText = `Stepwyse ${formatDate(new Date())}
${gameState.startWord} → ${gameState.targetWord} in ${chainLength} steps

${gameState.chain.map((item, i) => {
        if (i === 0) return item.word;
        return `→ ${item.word}`;
    }).join(' ')}

Play at https://nicholasballas.github.io/stepwyse`;
    
    // Try to use native share if available
    if (navigator.share) {
        navigator.share({
            title: 'Stepwyse',
            text: shareText
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!');
    }).catch(() => {
        alert('Could not copy to clipboard. Please copy manually.');
    });
}

// Statistics
function updateGlobalStats() {
    const stats = loadStats();
    
    stats.gamesPlayed++;
    
    if (!gameState.hasGivenUp) {
        // Update streak
        const lastPlayed = stats.lastPlayed;
        const today = getTodayString();
        
        if (lastPlayed === getYesterdayString()) {
            stats.currentStreak++;
        } else if (lastPlayed !== today) {
            stats.currentStreak = 1;
        }
        
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.lastPlayed = today;
        
        // Update average steps
        const chainLength = gameState.chain.length - 1;
        const totalSteps = stats.avgSteps * (stats.gamesPlayed - 1) + chainLength;
        stats.avgSteps = Math.round(totalSteps / stats.gamesPlayed * 10) / 10;
    }
    
    saveStats(stats);
}

function updateStatsDisplay() {
    const stats = loadStats();
    
    document.getElementById('gamesPlayed').textContent = stats.gamesPlayed;
    document.getElementById('currentStreak').textContent = stats.currentStreak;
    document.getElementById('maxStreak').textContent = stats.maxStreak;
    document.getElementById('avgSteps').textContent = stats.avgSteps;
}

// Storage
function saveGameState() {
    const state = {
        ...gameState,
        date: getTodayString()
    };
    localStorage.setItem('stepwyse-game', JSON.stringify(state));
}

function loadGameState() {
    const saved = localStorage.getItem('stepwyse-game');
    if (!saved) return null;
    
    const state = JSON.parse(saved);
    if (state.date !== getTodayString()) return null;
    
    return state;
}

function loadStats() {
    const saved = localStorage.getItem('stepwyse-stats');
    if (!saved) {
        return {
            gamesPlayed: 0,
            currentStreak: 0,
            maxStreak: 0,
            avgSteps: 0,
            lastPlayed: null
        };
    }
    return JSON.parse(saved);
}

function saveStats(stats) {
    localStorage.setItem('stepwyse-stats', JSON.stringify(stats));
}

// Date Utilities
function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
}

// Countdown to next puzzle
function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    setTimeout(updateCountdown, 1000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);
