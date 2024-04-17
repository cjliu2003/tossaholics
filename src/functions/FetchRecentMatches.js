import { supabase } from "../Supabase";

export const fetchRecentMatches = async () => {
    try {
        // Fetch the 100 most recent matches
        let { data: matches, error } = await supabase
            .from('match')
            .select(`
                match_timestamp,
                winning_team_id,
                losing_team_id,
                winning_team_score,
                losing_team_score
            `)
            .order('match_timestamp', { ascending: false })
            .limit(100);

        if (error) throw error;

        // Prepare a map to store team player IDs and subsequent queries
        let teamIds = [...new Set(matches.map(match => match.winning_team_id).concat(matches.map(match => match.losing_team_id)))];
        let { data: teams, error: teamError } = await supabase
            .from('team')
            .select('team_id, team_player_1_id, team_player_2_id')
            .in('team_id', teamIds);

        if (teamError) throw teamError;

        // Create a map of teams to easily reference player IDs
        let teamMap = {};
        teams.forEach(team => {
            teamMap[team.team_id] = { player1_id: team.team_player_1_id, player2_id: team.team_player_2_id };
        });

        // Get player IDs and fetch player names
        let playerIds = [...new Set(teams.flatMap(team => [team.team_player_1_id, team.team_player_2_id]))];
        let { data: players, error: playerError } = await supabase
            .from('player')
            .select('player_id, player_name')
            .in('player_id', playerIds);

        if (playerError) throw playerError;

        // Create a map of player IDs to player names
        let playerMap = {};
        players.forEach(player => {
            playerMap[player.player_id] = player.player_name;
        });

        // Construct the final data array
        let results = matches.map(match => ({
            match_timestamp: match.match_timestamp,
            winning_team_score: match.winning_team_score,
            losing_team_score: match.losing_team_score,
            winning_team_player_1_name: playerMap[teamMap[match.winning_team_id].player1_id],
            winning_team_player_2_name: playerMap[teamMap[match.winning_team_id].player2_id],
            losing_team_player_1_name: playerMap[teamMap[match.losing_team_id].player1_id],
            losing_team_player_2_name: playerMap[teamMap[match.losing_team_id].player2_id]
        }));

        return results;
    } catch (error) {
        console.error('Failed to fetch recent matches:', error);
        throw error;
    }
}
