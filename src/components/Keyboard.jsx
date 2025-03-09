import React from 'react';

const Keyboard = ({ onKeyClick, letterStatuses = {} }) => {
    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del']
    ];
    
    return (
        <div className="keyboard">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => {
                        const isSpecialKey = key === 'enter' || key === 'del';
                        const keyStatus = letterStatuses[key] || '';
                        
                        return (
                            <button
                                key={key}
                                className={`keyboard-key ${isSpecialKey ? 'special-key' : ''} ${keyStatus}`}
                                onClick={() => onKeyClick(key)}
                            >
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