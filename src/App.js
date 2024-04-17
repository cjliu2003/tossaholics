import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import SubmitMatch from './components/SubmitMatch';
import PlayerRankings from './components/PlayerRankings';
import CalculateOdds from './components/CalculateOdds';
import RatingsOverTime from './components/RatingsOverTime';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit-match" element={<SubmitMatch />} />
        <Route path="/player-rankings" element={<PlayerRankings />} />
        <Route path="/calculate-odds" element={<CalculateOdds />} />
        <Route path="/ratings-evolution" element={<RatingsOverTime />} />
      </Routes>
    </Router>
  );
}

export default App;
