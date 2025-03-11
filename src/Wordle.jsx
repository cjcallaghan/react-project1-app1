import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './wordle.css';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import wordsFile from "./words.txt";

const Wordle = () => {
    // Gameplya states
    const [currentGuess, setCurrentGuess] = useState(''); // Current in-progress guess
    const [guesses, setGuesses] = useState(Array(6).fill('')); // Array of all submitted guesses
    const [currentRow, setCurrentRow] = useState(0); // Current active row (0-5)
    const [targetWord, setTargetWord] = useState(''); // The word player needs to guess
    const [wordBank, setWordBank] = useState([]); // List of all valid words
    const [gameStatus, setGameStatus] = useState('playing'); // Game status: 'playing', 'won', 'lost'
    
    // UI states
    const [letterStatuses, setLetterStatuses] = useState({}); // Status of each letter on keyboard
    const [evaluations, setEvaluations] = useState(Array(6).fill(null)); // Evaluations for each guess
    const [showMessage, setShowMessage] = useState(''); // Toast message to display
    const [messageTimer, setMessageTimer] = useState(null); // Timer for clearing toast message

    // Load word bank from file and select random target word
    useEffect(() => {
        const loadWordBank = async () => {
            try {
                //throw new Error();
                // Fetch the word list file
                const response = await fetch(wordsFile);
                const result = await response.text();
                
                // Split the file content into words, handling different line endings
                let words;
                words = result.split("\r\n");
                
                // Filter out any empty strings from extra line breaks
                words = words.filter(word => word.trim().length > 0);
                
                // Convert all words to lowercase for consistency
                const lowerCaseWords = words.map(word => word.toLowerCase());
                setWordBank(lowerCaseWords);
                
                // Select random word as the target
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

    // Display a temporary toast message to the user
    const displayMessage = (message, duration = 2000) => {
        // Clear any existing timer
        if (messageTimer) {
            clearTimeout(messageTimer);
        }
        
        // Show the message
        setShowMessage(message);
        
        // Set a timer to clear the message
        const timer = setTimeout(() => {
            setShowMessage('');
        }, duration);
        setMessageTimer(timer);
    };

    // Evaluate a guess against the target word
    const evaluateGuess = (guess) => {
        if (!targetWord) return null;
        
        // Initialize all positions as 'absent'
        const evaluation = Array(5).fill('absent');
        
        // Convert words to arrays of characters
        const targetLetters = targetWord.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct letters (right letter in right position)
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                evaluation[i] = 'correct';
                targetLetters[i] = null; // Mark as used to prevent double-counting
            }
        }
        
        // Second pass: mark present letters (right letter in wrong position)
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

    // Update the status of each letter on the keyboard based on evaluations
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

    // Check if a word is in the valid word list
    const isValidWord = (word) => {
        return wordBank.includes(word.toLowerCase());
    };

    // Update game statistics in localStorage when a game ends
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

    // Submit the current guess for evaluation
    const submitGuess = () => {
        // Check if the guess has enough letters
        if (currentGuess.length !== 5) {
            displayMessage('Not enough letters');
            return;
        }
        
        // Check if the guess is a valid word
        if (!isValidWord(currentGuess)) {
            displayMessage('Not in word list');
            return;
        }
        
        // Process the guess if the game is still active
        if (currentRow < 6 && gameStatus === 'playing') {
            // Add the guess to the guesses array
            const newGuesses = [...guesses];
            newGuesses[currentRow] = currentGuess;
            setGuesses(newGuesses);
            
            // Evaluate the guess
            const evaluation = evaluateGuess(currentGuess);
            const newEvaluations = [...evaluations];
            newEvaluations[currentRow] = evaluation;
            setEvaluations(newEvaluations);
            
            // Update keyboard letter statuses
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
                // Move to next row
                setCurrentRow(currentRow + 1);
            }
            
            // Clear the current guess
            setCurrentGuess('');
        }
    };

    // Handle physical keyboard input
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
        
        // Only allow letters and limit to 5 characters
        if (currentGuess.length >= 5) return;
        
        if (e.key.match(/^[a-zA-Z]$/)) {
            setCurrentGuess((prev) => prev + e.key.toLowerCase());
        }
    };

    // Handle on-screen keyboard button clicks
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

    // Add keyboard event listener when component mounts
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentGuess, gameStatus, targetWord, wordBank]);

    // Clean up message timer when component unmounts
    useEffect(() => {
        return () => {
            if (messageTimer) {
                clearTimeout(messageTimer);
            }
        };
    }, [messageTimer]);

    // Start a new game with a fresh random word
    const startNewGame = () => {
        const randomIndex = Math.floor(Math.random() * wordBank.length);
        const selectedWord = wordBank[randomIndex].toLowerCase();
        setTargetWord(selectedWord);
        // Reset all game state
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
            {/* Game header with title and buttons */}
            <div className="wordle-header">
                <h1>Wordle</h1>
                <div className="header-buttons">
                    {/* Only show New Game button when game is over */}
                    {(gameStatus === 'won' || gameStatus === 'lost') && (
                        <button onClick={startNewGame} className="new-game-button">
                            New Game
                        </button>
                    )}
                    {/* Link to stats page */}
                    <Link to="/stats" className="stats-button">
                        <button>Stats</button>
                    </Link>
                </div>
            </div>

            {/* Toast message is the default naming convention for this kind of popup */}
            {showMessage && (
                <div className="message-toast">
                    {showMessage}
                </div>
            )}

            {/* Game board component */}
            <GameBoard
                guesses={guesses}
                currentRow={currentRow}
                currentGuess={currentGuess}
                evaluations={evaluations}
            />

            {/* Virtual keyboard component */}
            <Keyboard
                onKeyClick={handleKeyClick}
                letterStatuses={letterStatuses}
            />
        </div>
    );
};

export default Wordle;
