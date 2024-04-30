import React, { useState } from 'react';

import { players } from '../assets/Players';
import { fetchPlayerRatingFromPlayerName } from './fetchPlayerRatingFromName';
import { calculateOdds } from '../functions/CalculateOdds';

const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
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
      background: '#000',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px'
    },
    oddsContainer: {
      marginTop: '20px',
      textAlign: 'center'
    },
    oddsValue: {
      fontSize: 20,
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
  const handleSubmit = async (event) => {
    event.preventDefault();

    let teamAPlayer1Rating = await fetchPlayerRatingFromPlayerName(selectedPlayers.player1);
    let teamAPlayer2Rating = await fetchPlayerRatingFromPlayerName(selectedPlayers.player2);
    let teamBPlayer1Rating = await fetchPlayerRatingFromPlayerName(selectedPlayers.player3);
    let teamBPlayer2Rating = await fetchPlayerRatingFromPlayerName(selectedPlayers.player4);
    let result = await calculateOdds(teamAPlayer1Rating, teamAPlayer2Rating, teamBPlayer1Rating, teamBPlayer2Rating);

    setTeamScores({
      team1: { score: result.teamAWinProbability.toFixed(2), odds: result.teamAOdds },
      team2: { score: result.teamBWinProbability.toFixed(2), odds: result.teamBOdds }
    });

    // Here you would typically make an API call to calculate odds based on the selected players

    console.log('Submitting:', selectedPlayers);
  };


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
                <p style={styles.oddsValue}>
                  💰 Odds: {teamScores[`team${index + 1}`].odds >= 0 ? `+${teamScores[`team${index + 1}`].odds}` : teamScores[`team${index + 1}`].odds}
              </p>

              </div>
            )}
          </div>
        ))}
        <input type="submit" value="Calculate Odds" style={styles.submitButton} />
        <a style={{
            border: '1px solid black',
            color: 'black',
            padding: '10px',
            margin: '10px',
            borderRadius: '4px',
            textDecoration: 'none'
        
        }}href="/">Return home</a>
      </form>
    </div>
  );
}

export default CalculateOdds;
