import { supabase } from "../Supabase";

export async function InsertMatch(teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2, teamAScore, teamBScore) {
    // Helper function to check or insert players and return their IDs
    async function checkOrInsertPlayer(playerName) {
        let { data: player, error } = await supabase
            .from('player')
            .select('player_id')
            .eq('player_name', playerName)
            .single();

        if (error && error.message.includes('No rows found')) {
            const { data, error: insertError } = await supabase
                .from('Player')
                .insert([{ player_name: playerName, active: true, player_rating: 1500 }])
                .single();
            if (insertError) throw insertError;
            return data.id;
        } else if (error) {
            throw error;
        }

        return player.id;
    }

    // Helper function to create or fetch a team ID
    async function getOrCreateTeam(player1Id, player2Id) {
        let { data: team, error } = await supabase
            .from('team')
            .select('team_id')
            .or(`
            and(team_player_1_id.eq.${player1Id},team_player_2_id.eq.${player2Id}),
            and(team_player_1_id.eq.${player2Id},team_player_2_id.eq.${player1Id})
            `)
            .single();

        if (error && error.message.includes('No rows found')) {
            const { data, error: insertError } = await supabase
                .from('Team')
                .insert([{ team_player_1_id: player1Id, team_player_2_id: player2Id }])
                .single();
            if (insertError) throw insertError;
            return data.id;
        } else if (error) {
            throw error;
        }

        return team.id;
    }
    

    try {
        // Check or insert players and get their IDs
        const player1Id = await checkOrInsertPlayer(teamAPlayer1);
        const player2Id = await checkOrInsertPlayer(teamAPlayer2);
        const player3Id = await checkOrInsertPlayer(teamBPlayer1);
        const player4Id = await checkOrInsertPlayer(teamBPlayer2);

        // Get or create teams
        const team1Id = await getOrCreateTeam(player1Id, player2Id);
        const team2Id = await getOrCreateTeam(player3Id, player4Id);

        // Insert match
        const { data: match, error: matchError } = await supabase
            .from('MATCH')
            .insert([{
                match_timestamp: new Date().toISOString(),
                winning_team_id: teamAScore > teamBScore ? team1Id : team2Id,
                losing_team_id: teamAScore > teamBScore ? team2Id : team1Id,
                winning_team_score: Math.max(teamAScore, teamBScore),
                losing_team_score: Math.min(teamAScore, teamBScore)
            }])
            .single();
        if (matchError) throw matchError;

        // Optionally: Update player and team ratings
        console.log('Match inserted:', match);
    } catch (error) {
        console.error('Error inserting match:', error);
    }
}
