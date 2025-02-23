import React, { useState, useEffect } from 'react';
import './wordle.css';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';

//The game doesnt play properly yet but you can input letters and make guesses

const WordleGame = () => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState(Array(6).fill(''));
    const [currentRow, setCurrentRow] = useState(0);

    //takes input from keyboard using the event handler added below
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && currentGuess.length === 5) {
            submitGuess();
            return;
        }
        if (e.key === 'Backspace') {
            setCurrentGuess((prev) => prev.slice(0, -1));
        }
        if (currentGuess.length >= 5) return;
        if (e.key.match(/^[a-zA-Z]$/)) { //regex to make sure it's a single upper or lower case letter
            setCurrentGuess((prev) => prev + e.key.toLowerCase());
        }
    };

    //checks if the guess is valid and submits
    const submitGuess = () => {
        if (currentGuess.length === 5 && currentRow < 6) {
            const newGuesses = [...guesses];
            newGuesses[currentRow] = currentGuess;
            setGuesses(newGuesses);
            setCurrentRow(currentRow + 1);
            setCurrentGuess('');
        }
    };

    // keyboard event listener add and cleanup
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentGuess]);

    // handler for on screen keyboard
    const handleKeyClick = (key) => {
        if (key === 'del') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (key === 'enter') {
            if (currentGuess.length === 5) {
                submitGuess();
            }
        } else if (currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key);
        }
    };

    return (
        <div className="wordle-container">
            <div className="wordle-header">Wordle</div>

            <GameBoard
                guesses={guesses}
                currentRow={currentRow}
                currentGuess={currentGuess}
            />

            <Keyboard
                onKeyClick={handleKeyClick}
            />
        </div>
    );
};

export default WordleGame;