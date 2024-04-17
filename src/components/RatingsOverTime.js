import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { players } from '../assets/Players';

// Example ELO ratings for the players
const playerRatings = {
  'Player 1': [1500, 1520, 1540, 1560, 1580, 1600],
  'Player 2': [1400, 1420, 1400, 1440, 1450, 1470],
  'Player 3': [1300, 1320, 1340, 1360, 1380, 1400],
  'Player 4': [1200, 1220, 1240, 1260, 1280, 1300],
  'Player 5': [1100, 1120, 1140, 1160, 1180, 1200],
  'Player 6': [1000, 1020, 1040, 1060, 1080, 1100],
  'Player 7': [900, 920, 940, 960, 980, 1000],
  'Player 8': [800, 820, 840, 860, 880, 900],
  'Player 9': [700, 720, 740, 760, 780, 800],
  'Player 10': [600, 620, 640, 660, 680, 700],
  // Add more players and their ratings here...
};

function RatingsOverTime() {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [chartData, setChartData] = useState([
  ]);


  

  const handlePlayerSelect = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const addPlayerToChart = () => {
    // pick random number 1 to 10
    let number = Math.floor(Math.random() * 10) + 1;

    if (selectedPlayer && !chartData.some(data => data.label.includes(selectedPlayer))) {
      const newDataSet = {
        label: `${selectedPlayer}'s Rating Evolution`,
        data: playerRatings['Player ' + number],
        fill: false,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        tension: 0.1,
      };
      setChartData([...chartData, newDataSet]);
    }
  };

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: chartData,
  };

  return (
    <div className="container">
      <h1>Rating Evolution</h1>
      <div>
        <h2>Select a Player to Compare</h2>
        <select value={selectedPlayer} onChange={handlePlayerSelect}>
          <option value="">Select a player</option>
          {players.map((player, index) => (
            <option key={index} value={player}>{player}</option>
          ))}
        </select>
        <button onClick={addPlayerToChart}>Add Player to Chart</button>
      </div>
      <Line data={data} />
      <button>
        <a href="/">Return home</a>
      </button>
    </div>
  );
}

export default RatingsOverTime;
