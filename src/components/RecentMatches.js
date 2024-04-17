import React, { useEffect, useState } from 'react';
import { fetchRecentMatches } from '../functions/FetchRecentMatches';

const RecentMatches = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const callFetchRecentMatches = async () => {
            let fetchedMatches = await fetchRecentMatches();
            setMatches(fetchedMatches);
        };
        callFetchRecentMatches();
    }, []);

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

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto' }}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', color: '#333', marginBottom: '20px' }}>Recent Matches</h1>
            {matches.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerStyle}>
                            <th style={cellStyle}>Date</th>
                            <th style={cellStyle}>Outcome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match, index) => (
                            <tr key={index} style={rowStyle}>
                                <td style={cellStyle}>{new Date(match.match_timestamp).toLocaleDateString()}</td>
                                <td style={cellStyle}>
                                    {match.winning_team_player_1_name} & {match.winning_team_player_2_name} def. {match.losing_team_player_1_name} & {match.losing_team_player_2_name} ({match.winning_team_score} - {match.losing_team_score})
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
