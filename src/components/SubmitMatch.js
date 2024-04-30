import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchRankedPlayerList } from '../functions/FetchRankedPlayerList';
import { InsertMatch } from '../functions/InsertMatch';

function SubmitMatch() {
  const [submitted, setSubmitted] = useState(false);
  const [matchDetails, setMatchDetails] = useState('');
  const [rankedPlayerList, setRankedPlayerList] = useState([]);

  useEffect(() => {
    async function callFetchRankedPlayerList() {
      let fetchedRankedPlayerList = await fetchRankedPlayerList();
      fetchedRankedPlayerList = fetchedRankedPlayerList.map(item => item.player_name);
      setRankedPlayerList(fetchedRankedPlayerList);
    }
    callFetchRankedPlayerList();
  }, []);

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
  };

  const inputStyle = {
    marginBottom: '5px',
    display: 'block',
    marginTop: 4,
    padding: 8,
    width: 350,
    borderRadius: 4,
    fontSize: 16,
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.8rem',
    marginBottom: '10px',
  };

  const [formData, setFormData] = useState({
    teamAPlayer1: '',
    teamAPlayer2: '',
    teamBPlayer1: '',
    teamBPlayer2: '',
    teamAScore: '',
    teamBScore: '',
  });

  const [errors, setErrors] = useState({
    teamAPlayer1: false,
    teamAPlayer2: false,
    teamBPlayer1: false,
    teamBPlayer2: false,
  });

  const validatePlayer = (name, value) => {
    if (!rankedPlayerList.includes(value) && !value.startsWith("FOTH")) {
      setErrors({ ...errors, [name]: true });
    } else {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validatePlayer(name, value);
  };

  const checkForErrors = () => {
    const { teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2, teamAScore, teamBScore } = formData;
    if (teamAScore < 12 && teamBScore < 12) {
      return true;
    }
    if (teamAPlayer1 === teamAPlayer2 || teamBPlayer1 === teamBPlayer2) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkForErrors()) {
      alert('Please fill out all fields and ensure the score is at least 12.');
      return;
    }
    await InsertMatch(formData.teamAPlayer1, formData.teamAPlayer2, formData.teamBPlayer1, formData.teamBPlayer2, parseInt(formData.teamAScore), parseInt(formData.teamBScore));
    const winner = formData.teamAScore > formData.teamBScore ? `${formData.teamAPlayer1} and ${formData.teamAPlayer2}` : `${formData.teamBPlayer1} and ${formData.teamBPlayer2}`;
    const loser = formData.teamAScore > formData.teamBScore ? `${formData.teamBPlayer1} and ${formData.teamBPlayer2}` : ` ${formData.teamAPlayer1} and ${formData.teamAPlayer2}`;
    const score = formData.teamAScore > formData.teamBScore ? `${formData.teamAScore} - ${formData.teamBScore}` : `${formData.teamBScore} - ${formData.teamAScore}`;
    setMatchDetails(`${winner} beat ${loser}: ${score}`);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: '350px', margin: '0 auto'}}>
        <h2>Match Submitted!</h2>
        <p style={{fontSize: 20, textAlign: 'center'}}>{matchDetails}</p>
        <a href="/recent-matches">View Recent Matches</a>
      </div>
    );
  } else {
    return (
      <div style={{display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: '350px', margin: '0 auto'}}>
        <h2>Submit Match</h2>
        <p>Search for names and use the drop down menu to select your player. Most players should be in the database already, but if not, add a player here. Game must be played to 12 or more in order to be valid.</p>
        <form>
          {['teamAPlayer1', 'teamAPlayer2', 'teamBPlayer1', 'teamBPlayer2'].map((playerField, index) => (
            <React.Fragment key={index}>
              <label>
                {playerField.replace(/(\B[A-Z])/g, ' $1').replace('team', 'Team ').replace('Player', ' Player ')}:
                <input 
                  style={inputStyle}
                  list="players" 
                  type="text" 
                  name={playerField} 
                  value={formData[playerField]} 
                  onChange={handleChange} />
              </label>
              {errors[playerField] && <div>You must choose an existing player, navigate to the create player page and create them, or use "FOTH" options.</div>}
            </React.Fragment>
          ))}
          <datalist id="players">
            {rankedPlayerList.map((player, index) => (
              <option key={index} value={player} />
            ))}
          </datalist>
          <label 
          style={labelStyle}
          >
            Team A Score:
            <input 
            style={inputStyle}
            type="number" name="teamAScore" value={formData.teamAScore} onChange={handleChange} />
          </label>
          <label>
            Team B Score:
            <input  style={inputStyle} type="number" name="teamBScore" value={formData.teamBScore} onChange={handleChange} />
          </label>
          <button onClick={handleSubmit}
          style={{
            width: 350,
            padding: '10px',
            marginTop: '48px',
            backgroundColor: "#000",
            color: 'white',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >Submit</button>
        </form>
      </div>
    );
  }
}

export default SubmitMatch;
