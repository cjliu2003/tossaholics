import React, { useEffect, useState } from 'react';
import { fetchRecentMatches } from '../functions/FetchRecentMatches';
import { fetchPlayerRatingFromPlayerName } from './fetchPlayerRatingFromName';
import { removeMatch } from '../functions/deleteMatch';

const RecentMatches = () => {
    const [matches, setMatches] = useState([]);
    const [playerRatings, setPlayerRatings] = useState({});

    useEffect(() => {
        const callFetchRecentMatches = async () => {
            const fetchedMatches = await fetchRecentMatches();
            setMatches(fetchedMatches);
            updatePlayerRatings(fetchedMatches);
        };
        callFetchRecentMatches();
    }, []);

    const updatePlayerRatings = async (matches) => {
        const playersSet = new Set();
        matches.forEach(match => {
            playersSet.add(match.winning_team_player_1_name);
            playersSet.add(match.winning_team_player_2_name);
            playersSet.add(match.losing_team_player_1_name);
            playersSet.add(match.losing_team_player_2_name);
        });

        const ratings = {};
        for (let playerName of playersSet) {
            const rating = await fetchPlayerRatingFromPlayerName(playerName);
            ratings[playerName] = rating;
        }
        setPlayerRatings(ratings);
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const headerStyle = {
        backgroundColor: '#f0f0f0',
        color: '#333',
        fontWeight: 'bold',
        padding: '10px 15px',
        borderBottom: '2px solid #ddd'
    };

    const rowStyle = {
        borderBottom: '1px solid #ddd'
    };

    const cellStyle = {
        padding: '10px 15px',
        textAlign: 'left'
    };

    const linkStyle = {
        backgroundColor: '#000',
        color: 'white',
        padding: '10px',
        margin: '10px',
        borderRadius: '4px',
        textDecoration: 'none'
    };

    const handleDeleteMatch = async (matchId) => {
        await removeMatch(matchId);
    };

    return (
        <div style={{ width: 350, margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#333', marginBottom: '20px' }}>Recent Matches</h1>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a style={linkStyle} href="/">Home</a>     
                    <a style={linkStyle} href="/submit-match">Submit Match</a>
                </div>
            
            {matches.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerStyle}>
                            <th style={cellStyle}>Date</th>
                            <th style={cellStyle}>Outcome</th>
                            <th style={cellStyle}>Score</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match, index) => (
                            <tr key={index} style={rowStyle}>
                            <td style={cellStyle}>
                            {(() => {
                                const date = new Date(match.match_timestamp);
                                date.setHours(date.getHours() - 7); // Subtract 7 hours to convert to Pacific Time
                                return date.toLocaleDateString('en-US') + ' @ ' + 
                                    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' PT';
                            })()}
                        </td>


                                <td style={cellStyle}>
                                    <div>
                                        <span style={{ color: 'green', display: 'block', fontSize: 16 }}>
                                            {match.winning_team_player_1_name} <span style={{ color: 'black' }}>({playerRatings[match.winning_team_player_1_name]})</span>
                                            <br />
                                            {match.winning_team_player_2_name} {<span style={{ color: 'black' }}>({playerRatings[match.winning_team_player_2_name]})</span>}
                                        </span>
                                        <span style={{ margin: '0 10px', fontWeight: 'bold' }}>def.</span>
                                        <span style={{ color: 'red', display: 'block', fontSize: 16 }}>
                                            {match.losing_team_player_1_name} {<span style={{ color: 'black' }}>({playerRatings[match.losing_team_player_1_name]})</span>}
                                            <br />
                                            {match.losing_team_player_2_name} {<span style={{ color: 'black' }}>({playerRatings[match.losing_team_player_2_name]})</span>}
                                        </span>
                                    </div>
                                </td>
                                <td style={cellStyle}>{match.winning_team_score} - {match.losing_team_score}</td>
                                <td>
                                    <button 
                                    onClick={() => handleDeleteMatch(match.match_id)}
                                    
                                    style={{
                                        backgroundColor: 'black',
                                        color: 'red',
                                        fontSize: 12, 
                                        padding: 8,
                                        fontWeight: '600',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        border: 'none'
                                    }}>Request Removal</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>No recent matches found.</p>
            )}
        </div>
    );
};

export default RecentMatches;
