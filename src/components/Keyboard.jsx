import React from 'react';

const Keyboard = ({ onKeyClick }) => {
     // on screen keyboard layout
     const keyboardRows = [
          ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
          ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
          ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del']
     ];

     return (
          <div className="keyboard-container">
               {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                         {row.map((key) => (
                              <button
                                   key={key}
                                   onClick={() => onKeyClick(key)}
                                   className={`keyboard-key ${key === 'enter' ? 'enter-key' : ''}`}
                              >
                                   {key}
                              </button>
                         ))}
                    </div>
               ))}
          </div>
     );
};

export default Keyboard;