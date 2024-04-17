import React, { useEffect, useState } from 'react';
import { COLORS } from '../colors'; // Make sure COLORS has properties like red, purple, yellow
import { fetchRankedPlayerList } from '../functions/FetchRankedPlayerList';

function Home() {

  const [rankedPlayerList, setRankedPlayerList] = useState([]); 
  useEffect(() => {
    async function callFetchRankedPlayerList() {
      let fetchedRankedPlayerList = await fetchRankedPlayerList();
      setRankedPlayerList(fetchedRankedPlayerList.slice(0, 10));
    }
    callFetchRankedPlayerList();  
  }, []);

  const styles = {
    container: {
      width: '300px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    },
    heading: {
      color: COLORS.red, // Using red for the heading
      textAlign: 'center'
    },
    paragraph: {
      color: COLORS.purple, // Using purple for the paragraph
      textAlign: 'center'
    },
    button: {
      width: '100%',
      padding: '10px',
      marginTop: '10px',
      backgroundColor: COLORS.yellow, // Using yellow for buttons
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    link: {
      color: 'white',
      textDecoration: 'none'
    }
  };

  const renderRankIcon = (index) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    if (index === rankedPlayerList.length - 1) return '🐢';
    return index + 1;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Home Page</h2>
      <p style={styles.paragraph}>Welcome to the Tossaholics page, where you can view elo-based rankings, view match history, and submit match results.</p>
      <h2>
        Current Top 10 Players
      </h2>
      <p>last updated: {new Date().toLocaleDateString()} @ {new Date().toLocaleTimeString()}</p>
      <ul>
        {rankedPlayerList.map((player, index) => (
          <div key={index}>
            {renderRankIcon(index)} {player.player_name} ({player.player_rating})
          </div>
        ))}
      </ul>
      <button style={styles.button}>
        <a href="/submit-match" style={styles.link}>Submit Match</a>
      </button>
      <button style={styles.button}>
        <a href="/player-rankings" style={styles.link}>Player Rankings</a>
      </button>
      <button style={styles.button}>
        <a href="/calculate-odds" style={styles.link}>Calculate Odds</a>
      </button>
      <button style={styles.button}>
        <a href="/ratings-evolution" style={styles.link}>Rating Evolution</a>
      </button>
      <button style={styles.button}>
        <a href="/recent-matches" style={styles.link}>Recent Matches</a>
      </button>
    </div>
  );
}

export default Home;
