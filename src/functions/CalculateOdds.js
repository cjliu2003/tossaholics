export const calculateOdds = async (teamAPlayer1Rating, teamAPlayer2Rating, teamBPlayer1Rating, teamBPlayer2Rating) => {
    // Calculate average ratings for each team
    const teamARating = (teamAPlayer1Rating + teamAPlayer2Rating) / 2;
    const teamBRating = (teamBPlayer1Rating + teamBPlayer2Rating) / 2;

    // Calculate win probability for Team A
    const ratingDiff = teamBRating - teamARating;
    const teamAWinProbability = 1 / (1 + 10 ** (ratingDiff / 400));

    // Calculate American odds for Team A
    const teamAOdds = teamAWinProbability > 0.5 ?
        -((teamAWinProbability / (1 - teamAWinProbability)) * 100) :
        ((1 - teamAWinProbability) / teamAWinProbability) * 100;

    // Calculate win probability for Team B
    const teamBWinProbability = 1 - teamAWinProbability;

    // Calculate American odds for Team B
    const teamBOdds = teamBWinProbability > 0.5 ?
        -((teamBWinProbability / (1 - teamBWinProbability)) * 100) :
        ((1 - teamBWinProbability) / teamBWinProbability) * 100;

    return {
        teamAWinProbability: teamAWinProbability * 100, // Convert to percentage
        teamAOdds: Math.round(teamAOdds),
        teamBWinProbability: teamBWinProbability * 100, // Convert to percentage
        teamBOdds: Math.round(teamBOdds)
    };
}
