import React, { useState } from 'react';
import { players } from '../assets/Players';
import { InsertMatch } from '../functions/InsertMatch';

function SubmitMatch() {

  const [submitted, setSubmitted] = useState(false);


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
    if (!players.includes(value) && !value.startsWith("FOTH")) {
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

  const checkForErrors = ({
    teamAPlayer1,
    teamAPlayer2,
    teamBPlayer1,
    teamBPlayer2,
    teamAScore,
    teamBScore
  }) => {

    if (teamAScore < 12 && teamBScore < 12) {
      return true
    } 
    if (teamAPlayer1 === teamAPlayer2 || teamBPlayer1 === teamBPlayer2) {
      return true
    }

    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkForErrors({
      teamAPlayer1: formData.teamAPlayer1,
      teamAPlayer2: formData.teamAPlayer2,
      teamBPlayer1: formData.teamBPlayer1,
      teamBPlayer2: formData.teamBPlayer2,
      teamAScore: parseInt(formData.teamAScore),
      teamBScore: parseInt(formData.teamBScore)
    })) {
      alert('Please fill out all fields and ensure the score is at least 12.');
      return;
    }
    await InsertMatch(formData.teamAPlayer1, formData.teamAPlayer2, formData.teamBPlayer1, formData.teamBPlayer2, parseInt(formData.teamAScore), parseInt(formData.teamBScore));
  };
  
  

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
  };

  const inputStyle = {
    marginLeft: '10px',
    marginBottom: '5px',
    display: 'block',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.8rem',
    marginBottom: '10px',
  };
  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault(); // Prevent form submission
    }
  };

  if (submitted) {
    return (
      <div>
        <h2>Match Submitted!</h2>
        {/* reutrn home */}
        <button>
          <a href="/">Return home</a>
        </button>
      </div>
    )
  } else {
    return (
    <div style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',}}>
      <h2>Submit Match</h2>
      <p>Search for names and use the drop down menu to select your player. Most SigEps should be in the database already, but if not, add a player <a>here</a>. Game must be played to 12 or more in order to be valid.</p>
      <form>
        {['teamAPlayer1', 'teamAPlayer2', 'teamBPlayer1', 'teamBPlayer2'].map((playerField, index) => (
          <React.Fragment key={index}>
            <label style={labelStyle}>
              {playerField.replace(/(\B[A-Z])/g, ' $1').replace('team', 'Team ').replace('Player', ' Player ')}:
              <input 
                list="players" 
                style={inputStyle} 
                type="text" 
                name={playerField} 
                value={formData[playerField]} 
                onChange={handleChange} />
            </label>
            {errors[playerField] && <div style={errorStyle}>You must choose an existing player, navigate to the create player page and create them, or use "FOTH" options.</div>}
          </React.Fragment>
        ))}
        <datalist id="players">
          {players.map((player, index) => (
            <option key={index} value={player} />
          ))}
          <option value="FOTH (bad)" />
          <option value="FOTH (good)" />
          <option value="FOTH (really good)" />
        </datalist>
        {/* Score inputs remain unchanged */}
        <label style={labelStyle}>
          Team A Score:
          <input style={inputStyle} type="number" name="teamAScore" value={formData.teamAScore} onChange={handleChange} />
        </label>
        <label style={labelStyle}>
          Team B Score:
          <input style={inputStyle} type="number" name="teamBScore" value={formData.teamBScore} onChange={handleChange} />
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
    );
  }
}

export default SubmitMatch;
