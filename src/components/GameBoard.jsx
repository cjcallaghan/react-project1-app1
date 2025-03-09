import React from 'react';

const GameBoard = ({ guesses, currentRow, currentGuess, evaluations }) => {
    // Generate the grid with 6 rows and 5 columns
    const grid = [];
    
    for (let row = 0; row < 6; row++) {
        const rowCells = [];
        const rowGuess = row === currentRow ? currentGuess : guesses[row];
        const rowEvaluation = evaluations[row] || Array(5).fill(null);
        
        for (let col = 0; col < 5; col++) {
            let cellContent = '';
            let cellStatus = 'empty';
            
            if (row < currentRow) {
                // Completed row
                cellContent = guesses[row][col];
                cellStatus = rowEvaluation[col]; // 'correct', 'present', or 'absent'
            } else if (row === currentRow) {
                // Current row
                cellContent = rowGuess[col] || '';
                cellStatus = cellContent ? 'tbd' : 'empty';
            }
            
            rowCells.push(
                <div 
                    key={`${row}-${col}`} 
                    className={`cell ${cellStatus}`}
                >
                    {cellContent}
                </div>
            );
        }
        
        grid.push(
            <div key={row} className="board-row">
                {rowCells}
            </div>
        );
    }
    
    return (
        <div className="game-board">
            {grid}
        </div>
    );
};

export default GameBoard;