import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import SubmitMatch from './components/SubmitMatch';
import PlayerRankings from './components/PlayerRankings';
import CalculateOdds from './components/CalculateOdds';
import RatingsOverTime from './components/RatingsOverTime';
import RecentMatches from './components/RecentMatches';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit-match" element={<SubmitMatch />} />
        <Route path="/player-rankings" element={<PlayerRankings />} />
        <Route path="/calculate-odds" element={<CalculateOdds />} />
        <Route path="/ratings-evolution" element={<RatingsOverTime />} />
        <Route path="/recent-matches" element={<RecentMatches />} />
      </Routes>
    </Router>
  );
}

export default App;
