import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stats.css';

const Stats = () => {
    // Initialize stats state with default values
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalGuesses: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0] // Counts for each number of guesses 
    });

    // Load stats from localStorage 
    useEffect(() => {
        // Get stats from localStorage
        const statsString = localStorage.getItem('wordleStats');
        if (statsString) {
            setStats(JSON.parse(statsString));
        }
    }, []);

    // Calculate win percentage (rounded to nearest whole number)
    const winPercentage = stats.gamesPlayed > 0 
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
        : 0;

    // Calculate average number of guesses for won games (to 1 decimal place)
    const averageGuesses = stats.gamesWon > 0 
        ? (stats.totalGuesses / stats.gamesWon).toFixed(1) 
        : 0;

    // Find the maximum value in guess distribution for scaling the bar chart
    const maxDistribution = Math.max(...stats.guessDistribution);

    return (
        <div className="stats-container">
            {/* Header with title and back button */}
            <div className="stats-header">
                <h1>Statistics</h1>
                <Link to="/" className="back-button">
                    <button>Back to Game</button>
                </Link>
            </div>

            {/* Summary statistics section */}
            <div className="stats-summary">
                {/* Games played stat */}
                <div className="stat-box">
                    <span className="stat-number">{stats.gamesPlayed}</span>
                    <span className="stat-label">Played</span>
                </div>
                
                {/* Win percentage stat */}
                <div className="stat-box">
                    <span className="stat-number">{winPercentage}</span>
                    <span className="stat-label">Win %</span>
                </div>
                
                {/* Games won stat */}
                <div className="stat-box">
                    <span className="stat-number">{stats.gamesWon}</span>
                    <span className="stat-label">Won</span>
                </div>
                
                {/* Games lost stat */}
                <div className="stat-box">
                    <span className="stat-number">{stats.gamesLost}</span>
                    <span className="stat-label">Lost</span>
                </div>
                
                {/* Average guesses stat */}
                <div className="stat-box">
                    <span className="stat-number">{averageGuesses}</span>
                    <span className="stat-label">Avg. Guesses</span>
                </div>
            </div>

            {/* Guess distribution visualization section */}
            <div className="guess-distribution">
                <h2>Guess Distribution</h2>
                <div className="distribution-container">
                    {/* Create a bar for each possible number of guesses */}
                    {stats.guessDistribution.map((count, index) => (
                        <div className="distribution-row" key={index}>
                            {/* Display the guess number */}
                            <div className="guess-number">{index + 1}</div>
                            
                            {/* Bar visualization with width proportional to count */}
                            <div 
                                className="distribution-bar"
                                style={{ 
                                    // Calculate width as percentage of max value (or 0 if no data)
                                    width: maxDistribution > 0 ? `${(count / maxDistribution) * 100}%` : '0%',
                                    // Use green for bars with data, gray for empty bars
                                    backgroundColor: count > 0 ? '#6aaa64' : '#787c7e',
                                }}
                            >
                                {/* Display the count inside the bar */}
                                <span className="distribution-count">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stats;