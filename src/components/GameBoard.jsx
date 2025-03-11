import React from 'react';

const GameBoard = ({ guesses, currentRow, currentGuess, evaluations }) => {
    // Initialize an empty array to hold all the grid rows
    const grid = [];
    
    // Create 6 rows 
    for (let row = 0; row < 6; row++) {
        const rowCells = [];
        
        // Determine which guess to use for this row:
        // For the current row use the in-progress guess
        // For completed rows use the submitted guess
        const rowGuess = row === currentRow ? currentGuess : guesses[row];
        
        // Get the evaluation for this row, or use null if not evaluated yet
        const rowEvaluation = evaluations[row] || Array(5).fill(null);
        
        // Create 5 cells for each row 
        for (let col = 0; col < 5; col++) {
            let cellContent = '';
            let cellStatus = 'empty';
            
            if (row < currentRow) {
                // This is a completed row with an evaluated guess
                cellContent = guesses[row][col];
                cellStatus = rowEvaluation[col]; // correct present, or absent
            } else if (row === currentRow) {
                // This is the current active row
                cellContent = rowGuess[col] || '';
                cellStatus = cellContent ? 'tbd' : 'empty';
            }
            // Rows after currentRow remain empty
            
            // Create the cell element and add it to rowCells array
            rowCells.push(
                <div 
                    key={`${row}-${col}`} 
                    className={`cell ${cellStatus}`}
                >
                    {cellContent}
                </div>
            );
        }
        
        // Add the completed row to the grid
        grid.push(
            <div key={row} className="board-row">
                {rowCells}
            </div>
        );
    }
    
    // Render the complete game board with all rows
    return (
        <div className="game-board">
            {grid}
        </div>
    );
};

export default GameBoard;