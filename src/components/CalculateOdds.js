import React, { useState } from 'react';

import { players } from '../assets/Players';

const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    title: {
      textAlign: 'center',
      color: '#333'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    select: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc',
      background: 'white'
    },
    submitButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      background: '#007bff',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px'
    },
    oddsContainer: {
      marginTop: '20px',
      textAlign: 'center'
    },
    oddsValue: {
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#28a745'
    }
  };

function CalculateOdds() {
  // State to manage player selections and scores
  const [selectedPlayers, setSelectedPlayers] = useState({
    player1: '',
    player2: '',
    player3: '',
    player4: ''
  });
  const [teamScores, setTeamScores] = useState({
    team1: { score: null, odds: null },
    team2: { score: null, odds: null }
  });

  // Function to handle the form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setScoresToRandom()
    // Here you would typically make an API call to calculate odds based on the selected players

    console.log('Submitting:', selectedPlayers);
  };

  const setScoresToRandom = () => {
    // each team will have a probability and they add to 1, odds refelct that
    const team1Score = Math.random();
    const team2Score = 1 - team1Score;
    setTeamScores({
      team1: { score: (team1Score * 100).toFixed(2), odds: (1 / team1Score).toFixed(2) },
      team2: { score: (team2Score * 100).toFixed(2), odds: (1 / team2Score).toFixed(2) }
    });
  }

  // Function to update the state when a player is selected
  const handlePlayerChange = (player, value) => {
    setSelectedPlayers(prev => ({
      ...prev,
      [player]: value
    }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Calculate Odds</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {['team1', 'team2'].map((team, index) => (
          <div key={team}>
            <label>{`Team ${index + 1}`} </label>
            <select
              value={selectedPlayers[`player${index * 2 + 1}`]}
              onChange={(e) => handlePlayerChange(`player${index * 2 + 1}`, e.target.value)}
              style={styles.select}
            >
              <option value="" disabled>Select player {index * 2 + 1}</option>
              {players.map(player => (
                <option key={player} value={player}>{player}</option>
              ))}
            </select>
            <select
              value={selectedPlayers[`player${index * 2 + 2}`]}
              onChange={(e) => handlePlayerChange(`player${index * 2 + 2}`, e.target.value)}
              style={styles.select}
            >
              <option value="" disabled>Select player {index * 2 + 2}</option>
              {players.map(player => (
                <option key={player} value={player}>{player}</option>
              ))}
            </select>
            {teamScores[`team${index + 1}`].score && (
              <div style={styles.oddsContainer}>
                <p style={styles.oddsValue}>🏆 Chance of winning: {teamScores[`team${index + 1}`].score}%</p>
                <p style={styles.oddsValue}>💰 Odds: {teamScores[`team${index + 1}`].odds}</p>
              </div>
            )}
          </div>
        ))}
        <input type="submit" value="Calculate Odds" style={styles.submitButton} />
      </form>
      <button>
        <a href="/">Return home</a>
      </button>
    </div>
  );
}

export default CalculateOdds;
