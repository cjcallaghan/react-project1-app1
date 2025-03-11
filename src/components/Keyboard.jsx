import React from 'react';

const Keyboard = ({ onKeyClick, letterStatuses = {} }) => {
    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del']
    ];
    
    return (
        <div className="keyboard">
            {/* Map through each row of keys */}
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {/* Map through each key in the current row */}
                    {row.map((key) => {
                        // Check if this is a special key (enter or delete)
                        const isSpecialKey = key === 'enter' || key === 'del';
                        // Get the status of this key from the letterStatuses prop (for coloring)
                        const keyStatus = letterStatuses[key] || '';
                        
                        return (
                            <button
                                key={key}
                                // Apply CSS classes based on key status and type
                                className={`keyboard-key ${isSpecialKey ? 'special-key' : ''} ${keyStatus}`}
                                // Call the onKeyClick function when the button is clicked
                                onClick={() => onKeyClick(key)}
                            >
                                {/* Display the backspace symbol for the delete key */}
                                {key === 'del' ? '⌫' : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;