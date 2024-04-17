import React, { useEffect, useState } from 'react';
import { fetchRankedPlayerList } from '../functions/FetchRankedPlayerList';

function PlayerRankings() {
  const [rankedPlayerList, setRankedPlayerList] = useState([]);

  useEffect(() => {
    async function callFetchRankedPlayerList() {
      let fetchedRankedPlayerList = await fetchRankedPlayerList();
      setRankedPlayerList(fetchedRankedPlayerList);
    }
    callFetchRankedPlayerList();
  }, []);
  
  // Helper function to determine the rank display
  const renderRankIcon = (index) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    if (index === rankedPlayerList.length - 1) return '🐢';
    if (rankedPlayerList.length > 10 && index >= rankedPlayerList.length - 10) return `${index + 1} (🗑️)`;
    return index + 1;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ width: '300px' }}>
      <button>
        <a href="/">go back</a>
      </button>
        <h2 style={{ textAlign: 'center' }}>Player Rankings</h2>
        <p style={{ textAlign: 'center' }}>View the latest player rankings.</p>
        <ul style={{
          listStyleType: 'none',
          padding: 0,
          margin: 0
        }}>
          {rankedPlayerList.map((player, index) => (
            <li key={index} style={{
              padding: '10px',
              backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ddd',
              fontSize: '16px'
            }}>
              <span style={{ fontWeight: 'bold' }}>{renderRankIcon(index)}</span>
              <span>{player.player_name}</span>
              <span>{player.player_rating}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerRankings;
