import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stats.css'; // You'll need to create this CSS file

const Stats = () => {
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalGuesses: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0]
    });

    useEffect(() => {
        // Load stats from localStorage
        const statsString = localStorage.getItem('wordleStats');
        if (statsString) {
            setStats(JSON.parse(statsString));
        }
    }, []);

    // Calculate win percentage
    const winPercentage = stats.gamesPlayed > 0 
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
        : 0;

    // Calculate average guesses (only for won games)
    const averageGuesses = stats.gamesWon > 0 
        ? (stats.totalGuesses / stats.gamesWon).toFixed(1) 
        : 0;

    // Find max value in guess distribution for scaling the bars
    const maxDistribution = Math.max(...stats.guessDistribution);

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h1>Statistics</h1>
                <Link to="/" className="back-button">
                    <button>Back to Game</button>
                </Link>
            </div>

            <div className="stats-summary">
                <div className="stat-box">
                    <span className="stat-number">{stats.gamesPlayed}</span>
                    <span className="stat-label">Played</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{winPercentage}</span>
                    <span className="stat-label">Win %</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{stats.gamesWon}</span>
                    <span className="stat-label">Won</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{stats.gamesLost}</span>
                    <span className="stat-label">Lost</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{averageGuesses}</span>
                    <span className="stat-label">Avg. Guesses</span>
                </div>
            </div>

            <div className="guess-distribution">
                <h2>Guess Distribution</h2>
                <div className="distribution-container">
                    {stats.guessDistribution.map((count, index) => (
                        <div className="distribution-row" key={index}>
                            <div className="guess-number">{index + 1}</div>
                            <div 
                                className="distribution-bar"
                                style={{ 
                                    width: maxDistribution > 0 ? `${(count / maxDistribution) * 100}%` : '0%',
                                    backgroundColor: count > 0 ? '#6aaa64' : '#787c7e',
                                }}
                            >
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