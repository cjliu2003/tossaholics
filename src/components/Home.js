import React from 'react';

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the Tossaholics page, where you can view elo-based rankings, view match history, and submit match results.</p>
      <button>
        <a href="/submit-match">Submit Match</a>
      </button>
      <button>
        <a href="/player-rankings">Player Rankings</a>
      </button>
      <button>
        <a href="/calculate-odds">Calculate Odds</a>
      </button>
      <button>
        <a href="/ratings-evolution">Rating Evolution</a>
      </button>
    </div>
  );
}

export default Home;
