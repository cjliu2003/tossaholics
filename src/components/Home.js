import React, { useEffect, useState } from 'react';
import { COLORS } from '../colors'; // Make sure COLORS has properties like red, purple, yellow
import { fetchRankedPlayerList } from '../functions/FetchRankedPlayerList';
import { FaGamepad, FaListOl, FaCalculator, FaChartLine, FaClock } from 'react-icons/fa'; // Importing FontAwesome icons
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
      backgroundColor: "#000", // Using yellow for buttons
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
    return `${index + 1}.`;
  };

  return (
    <div style={styles.container}>
      <h2>
        Current Top 10 Players
      </h2>
      <p>last updated: {new Date().toLocaleDateString()} @ {new Date().toLocaleTimeString()}</p>
      <div style={{alignSelf: 'center'}}>
        {rankedPlayerList.map((player, index) => (
          <p key={index}>
            {renderRankIcon(index)} {player.player_name} ({player.player_rating})
          </p>
        ))}
      </div>
      <button style={styles.button}>
        <FaGamepad />
        <a href="/submit-match" style={styles.link}>Submit Match</a>
      </button>
      <button style={styles.button}>
        <FaListOl />
        <a href="/player-rankings" style={styles.link}>Player Rankings</a>
      </button>
      <button style={styles.button}>
        <FaCalculator />
        <a href="/calculate-odds" style={styles.link}>Calculate Odds</a>
      </button>
      <button style={styles.button}>
        <FaChartLine />
        <a href="/ratings-evolution" style={styles.link}>Rating Evolution</a>
      </button>
      <button style={styles.button}>
        <FaClock />
        <a href="/recent-matches" style={styles.link}>Recent Matches</a>
      </button>
    </div>
  );
}

export default Home;
