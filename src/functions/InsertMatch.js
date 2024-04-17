import { supabase } from "../Supabase";

export async function InsertMatch(teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2, teamAScore, teamBScore) {
    // Helper function to check or insert players and return their IDs
    async function checkOrInsertPlayer(playerName) {
        try {
            // Query the player table to find the first match where player_name equals playerName
            const { data, error } = await supabase
              .from('player')
              .select('player_id')
              .eq('player_name', playerName)
              .single();  // Use .single() to expect a single row response
        
            if (error) {
              console.error('Error fetching player ID:', error);
              return null;
            }
        
            // Return the player_id if a player was found
            return data ? data.player_id : null;
          } catch (error) {
            console.error('An error occurred:', error);
            return null;
          }
    }

    // Helper function to create or fetch a team ID
    async function getOrCreateTeam(player1Id, player2Id) {
        try {
            // Try to find an existing team with the two players, regardless of order
            let { data: team, error } = await supabase
                .from('team')
                .select('team_id')
                .or(
                    `team_player_1_id.eq.${player1Id},team_player_2_id.eq.${player2Id}`,
                    `team_player_1_id.eq.${player2Id},team_player_2_id.eq.${player1Id}`
                )
                .single();
            // If a team is found, return the team_id
            if (team) {
                return team.team_id;
            }
    
            // If no team is found and the error message includes 'No rows found', create a new team
            if (error && error.details.includes('0 rows')) {
                const { data: team, error: insertError } = await supabase
                    .from('team')
                    .insert([{ team_player_1_id: player1Id, team_player_2_id: player2Id }])
                    .select("*")  // Select all fields from the newly created row
                    .single();
                if (insertError) throw insertError; // Throw an error if there's an issue with the insertion
                console.log("data", team)
                return team.team_id; // Return the new team's ID
            } else if (error) {
                throw error; // Throw any other errors that may occur
            }
        } catch (error) {
            // Handle any exceptions that occur during the function execution
            console.error('Failed to get or create team:', error);
            throw error; // Rethrow the error after logging it
        }
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
            .from('match')
            .insert([{
                match_timestamp: new Date().toISOString(),
                winning_team_id: teamAScore > teamBScore ? team1Id : team2Id,
                losing_team_id: teamAScore > teamBScore ? team2Id : team1Id,
                winning_team_score: Math.max(teamAScore, teamBScore),
                losing_team_score: Math.min(teamAScore, teamBScore)
            }])
            .select('*')
            .single();
        if (matchError) throw matchError;

        console.log('Match inserted:', match);
    } catch (error) {
        console.error('Error inserting match:', error);
    }

}
