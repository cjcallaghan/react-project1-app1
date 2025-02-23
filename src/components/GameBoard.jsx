import React from 'react';

const GameBoard = ({ guesses, currentRow, currentGuess }) => {
     return (
          <div className="game-board">
               {/* 6 rows of guesses */}
               {guesses.map((guess, rowIndex) => (
                    <div key={rowIndex} className="game-row">
                         {/* 5 boxes for each letter*/}
                         {[...Array(5)].map((_, colIndex) => { 
                              // figure out which letter to show
                              const letter = rowIndex === currentRow 
                                   ? currentGuess[colIndex] 
                                   : guess[colIndex];
                              
                              //render each letter box with correct css
                              return (
                                   <div
                                        key={colIndex}
                                        className={`game-cell ${rowIndex === currentRow ? 'current' : ''} ${letter ? 'filled' : ''}`}
                                   >
                                        {letter || ''}
                                   </div>
                              );
                         })}
                    </div>
               ))}
          </div>
     );
};

export default GameBoard;