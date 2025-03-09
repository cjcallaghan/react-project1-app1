import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './wordle.css';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import wordsFile from "./words.txt";

const Wordle = () => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState(Array(6).fill(''));
    const [currentRow, setCurrentRow] = useState(0);
    const [targetWord, setTargetWord] = useState('');
    const [wordBank, setWordBank] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [letterStatuses, setLetterStatuses] = useState({});
    const [evaluations, setEvaluations] = useState(Array(6).fill(null));
    const [showMessage, setShowMessage] = useState('');
    const [messageTimer, setMessageTimer] = useState(null);

    // Load word bank and select random word
    useEffect(() => {
        const loadWordBank = async () => {
            try {
                //throw new Error("")
                const response = await fetch(wordsFile);
                const result = await response.text();
                
                // Handle different line endings based on operating system
                let words;
                words = result.split("\r\n");
                
                // Filter out any empty strings that might come from extra line breaks
                words = words.filter(word => word.trim().length > 0);
                
                // Convert all words to lowercase
                const lowerCaseWords = words.map(word => word.toLowerCase());
                setWordBank(lowerCaseWords);
                
                // Select random word
                const randomIndex = Math.floor(Math.random() * lowerCaseWords.length);
                const selectedWord = lowerCaseWords[randomIndex];
                setTargetWord(selectedWord);
                console.log('Target word:', selectedWord); // For debugging
            } catch (error) {
                console.error('Error loading word bank:', error);
                // Fallback to a default word list if the file can't be loaded
                const fallbackWords = ['react', 'state', 'props', 'hooks', 'redux'];
                setWordBank(fallbackWords);
                setTargetWord(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
            }
        };

        loadWordBank();
    }, []);

    // Display temporary message
    const displayMessage = (message, duration = 2000) => {
        // Clear any existing timer
        if (messageTimer) {
            clearTimeout(messageTimer);
        }
        
        setShowMessage(message);
        const timer = setTimeout(() => {
            setShowMessage('');
        }, duration);
        setMessageTimer(timer);
    };

    // Evaluate a guess against the target word
    const evaluateGuess = (guess) => {
        if (!targetWord) return null;
        
        const evaluation = Array(5).fill('absent');
        const targetLetters = targetWord.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                evaluation[i] = 'correct';
                targetLetters[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < 5; i++) {
            if (evaluation[i] === 'absent') {
                const targetIndex = targetLetters.indexOf(guessLetters[i]);
                if (targetIndex !== -1) {
                    evaluation[i] = 'present';
                    targetLetters[targetIndex] = null; // Mark as used
                }
            }
        }
        
        return evaluation;
    };

    // Update letter statuses for keyboard
    const updateLetterStatuses = (guess, evaluation) => {
        const newStatuses = { ...letterStatuses };
        
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const status = evaluation[i];
            
            // Only update if the new status is better than the existing one
            // Priority: correct > present > absent
            if (!newStatuses[letter] || 
                (newStatuses[letter] === 'absent' && (status === 'present' || status === 'correct')) ||
                (newStatuses[letter] === 'present' && status === 'correct')) {
                newStatuses[letter] = status;
            }
        }
        
        setLetterStatuses(newStatuses);
    };

    // Check if the guess is a valid word
    const isValidWord = (word) => {
        return wordBank.includes(word.toLowerCase());
    };

    // Update game statistics in localStorage
    const updateGameStats = (won, numGuesses) => {
        // Get current stats from localStorage or initialize if not present
        const statsString = localStorage.getItem('wordleStats');
        let stats = statsString 
            ? JSON.parse(statsString) 
            : { gamesPlayed: 0, gamesWon: 0, gamesLost: 0, totalGuesses: 0, guessDistribution: [0, 0, 0, 0, 0, 0] };
        
        // Update stats
        stats.gamesPlayed += 1;
        
        if (won) {
            stats.gamesWon += 1;
            stats.totalGuesses += numGuesses;
            // Update guess distribution (arrays are 0-indexed, but guesses are 1-indexed)
            stats.guessDistribution[numGuesses - 1] += 1;
        } else {
            stats.gamesLost += 1;
        }
        
        // Save updated stats to localStorage
        localStorage.setItem('wordleStats', JSON.stringify(stats));
    };

    // Submit a guess
    const submitGuess = () => {
        if (currentGuess.length !== 5) {
            displayMessage('Not enough letters');
            return;
        }
        
        if (!isValidWord(currentGuess)) {
            displayMessage('Not in word list');
            return;
        }
        
        if (currentRow < 6 && gameStatus === 'playing') {
            const newGuesses = [...guesses];
            newGuesses[currentRow] = currentGuess;
            setGuesses(newGuesses);
            
            const evaluation = evaluateGuess(currentGuess);
            const newEvaluations = [...evaluations];
            newEvaluations[currentRow] = evaluation;
            setEvaluations(newEvaluations);
            
            updateLetterStatuses(currentGuess, evaluation);
            
            // Check if the game is won
            if (currentGuess === targetWord) {
                setGameStatus('won');
                displayMessage('Congratulations!', 3000);
                // Update stats with win and number of guesses used
                updateGameStats(true, currentRow + 1);
            } else if (currentRow === 5) {
                // Last row, game over
                setGameStatus('lost');
                displayMessage(`The word was ${targetWord.toUpperCase()}`, 5000);
                // Update stats with loss
                updateGameStats(false, 0);
            } else {
                setCurrentRow(currentRow + 1);
            }
            
            setCurrentGuess('');
        }
    };

    // Handle keyboard input
    const handleKeyPress = (e) => {
        if (gameStatus !== 'playing') return;
        
        if (e.key === 'Enter') {
            submitGuess();
            return;
        }
        
        if (e.key === 'Backspace') {
            setCurrentGuess((prev) => prev.slice(0, -1));
            return;
        }
        
        if (currentGuess.length >= 5) return;
        
        if (e.key.match(/^[a-zA-Z]$/)) {
            setCurrentGuess((prev) => prev + e.key.toLowerCase());
        }
    };

    // Handle on-screen keyboard clicks
    const handleKeyClick = (key) => {
        if (gameStatus !== 'playing') return;
        
        if (key === 'enter') {
            submitGuess();
        } else if (key === 'del') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key);
        }
    };

    // Add and remove keyboard event listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentGuess, gameStatus, targetWord, wordBank]);

    // Clean up message timer on unmount
    useEffect(() => {
        return () => {
            if (messageTimer) {
                clearTimeout(messageTimer);
            }
        };
    }, [messageTimer]);

    // Start a new game
    const startNewGame = () => {
        const randomIndex = Math.floor(Math.random() * wordBank.length);
        const selectedWord = wordBank[randomIndex].toLowerCase();
        setTargetWord(selectedWord);
        setGuesses(Array(6).fill(''));
        setCurrentRow(0);
        setCurrentGuess('');
        setGameStatus('playing');
        setLetterStatuses({});
        setEvaluations(Array(6).fill(null));
        setShowMessage('');
    };

    return (
        <div className="wordle-container">
            <div className="wordle-header">
                <h1>Wordle</h1>
                <div className="header-buttons">
                    {(gameStatus === 'won' || gameStatus === 'lost') && (
                        <button onClick={startNewGame} className="new-game-button">
                            New Game
                        </button>
                    )}
                    <Link to="/stats" className="stats-button">
                        <button>Stats</button>
                    </Link>
                </div>
            </div>

            {showMessage && (
                <div className="message-toast">
                    {showMessage}
                </div>
            )}

            <GameBoard
                guesses={guesses}
                currentRow={currentRow}
                currentGuess={currentGuess}
                evaluations={evaluations}
            />

            <Keyboard
                onKeyClick={handleKeyClick}
                letterStatuses={letterStatuses}
            />
        </div>
    );
};

export default Wordle;