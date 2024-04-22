import { supabase } from "../Supabase";

export async function InsertMatch(teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2, teamAScore, teamBScore) {

    // Helper function to check or insert players and return their IDs
    async function checkOrInsertPlayer(playerName) {
        try {
            let { data: player, error } = await supabase
                .from('player')
                .select('player_id')
                .eq('player_name', playerName)
                .single();

            if (error && error.message.includes('No rows found')) {
                const { data, error: insertError } = await supabase
                    .from('Player')
                    .insert([{ player_name: playerName, active: true, player_rating: 1500 }])
                    .select();
                if (insertError) {
                    console.log("Insert Error:", insertError)
                    throw insertError;
                }
                return data[0].player_id;
            } else if (error) {
                console.log("Error Checking Players:", error)
                throw error;
            }
            return player.player_id;
    } catch (err) {
        console.error('Unexpected error:', err);
    }
    }
    

    // Helper function to create or fetch a team ID
    async function getOrCreateTeam(player1Id, player2Id) {
        console.log(player1Id, player2Id);
        let { data: team, error: fetchError } = await supabase
            .from('team')
            .select('team_id')
            .eq('team_player_1_id', player1Id)
            .eq('team_player_2_id', player2Id)
            .single();
    
        if (team) return team.team_id;
    
        let { data: teamv2, error: fetchErrorv2 } = await supabase
            .from('team')
            .select('team_id')
            .eq('team_player_1_id', player2Id)
            .eq('team_player_2_id', player1Id)
            .single();
    
        if (teamv2) return teamv2.team_id;
    
        // Handle the case where no team is found after both queries
        if (fetchError && fetchError.details.includes('0 rows') &&
            fetchErrorv2 && fetchErrorv2.details.includes('0 rows')) {
            // No team found, proceed to create a new team
            const { data: newTeam, error: insertError } = await supabase
                .from('team')
                .insert([{ team_player_1_id: player1Id, team_player_2_id: player2Id }])
                .select();
    
            if (insertError) {
                console.error('Insert error:', insertError);
                throw insertError; // Throwing here to escalate to the try/catch block outside
            }
            console.log("New team created:", newTeam.team_id);
            return newTeam[0].team_id;
        }
    
        // If either fetchError or fetchErrorv2 has an error other than '0 rows', log it
        if (fetchError && !fetchError.details.includes('0 rows')) {
            console.error('Unexpected fetch error:', fetchError);
        }
        if (fetchErrorv2 && !fetchErrorv2.details.includes('0 rows')) {
            console.error('Unexpected fetch error:', fetchErrorv2);
        }
    
        // If reached this point, an error occurred that wasn't handled
        // You could return null, or throw an error, depending on how you want to handle this case
        return null; // or throw new Error('Failed to get or create team.');
    }
    
    //Helper function to handle match inserts (match, playermatch, teammatch)
    async function handleMatchUpdate(player1_id, player2_id, player3_id, player4_id, team1Id, team2Id) {
        try {
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
                .select();
            if (matchError) throw matchError;
            console.log("match data:", match);
            const match_id = match[0].match_id;

            // Insert players into the PlayerMatch table
            const playerIds = [player1_id, player2_id, player3_id, player4_id];
            let playerMatchIds = [];
            for (const player_id of playerIds) {
                const { data, error: playerMatchError } = await supabase
                    .from('playermatch')
                    .insert([
                        { player_id, match_id }
                    ])
                    .select();

                if (playerMatchError) {
                    console.error('Error inserting into PlayerMatch:', playerMatchError);
                    throw playerMatchError;
                }
                playerMatchIds.push(data[0].player_match_id);
                //append to player_match_ids
            }

            // Insert teams into the TeamMatch table
            const teamIds = [match[0].winning_team_id, match[0].losing_team_id];
            for (const team_id of teamIds) {
                console.log("teamID, teammatch insert:", team_id)
                const { error: teamMatchError } = await supabase
                    .from('teammatch')
                    .insert([
                        { team_id, match_id }
                    ]);

                if (teamMatchError) {
                    console.error('Error inserting into TeamMatch:', teamMatchError);
                    throw teamMatchError;
                }
            }
            console.log("DEBUG: playerMatchIds list check (pre return):", playerMatchIds);
            return playerMatchIds;
        } catch (err) {
            console.error('Unexpected error:', err);
        }

    }

    function calculateExpectedScores(player1Rating, player2Rating, player3Rating, player4Rating) {
        const player1ExpectedScoreAgainstPlayer3 = 1 / (1 + 10 ** ((player3Rating - player1Rating) / 500));
        const player1ExpectedScoreAgainstPlayer4 = 1 / (1 + 10 ** ((player4Rating - player1Rating) / 500));
        const player1ExpectedScore = (player1ExpectedScoreAgainstPlayer3 + player1ExpectedScoreAgainstPlayer4) / 2;
      
        const player2ExpectedScoreAgainstPlayer3 = 1 / (1 + 10 ** ((player3Rating - player2Rating) / 500));
        const player2ExpectedScoreAgainstPlayer4 = 1 / (1 + 10 ** ((player4Rating - player2Rating) / 500));
        const player2ExpectedScore = (player2ExpectedScoreAgainstPlayer3 + player2ExpectedScoreAgainstPlayer4) / 2;
      
        const player3ExpectedScoreAgainstPlayer1 = 1 / (1 + 10 ** ((player1Rating - player3Rating) / 500));
        const player3ExpectedScoreAgainstPlayer2 = 1 / (1 + 10 ** ((player2Rating - player3Rating) / 500));
        const player3ExpectedScore = (player3ExpectedScoreAgainstPlayer1 + player3ExpectedScoreAgainstPlayer2) / 2;
      
        const player4ExpectedScoreAgainstPlayer1 = 1 / (1 + 10 ** ((player1Rating - player4Rating) / 500));
        const player4ExpectedScoreAgainstPlayer2 = 1 / (1 + 10 ** ((player2Rating - player4Rating) / 500));
        const player4ExpectedScore = (player4ExpectedScoreAgainstPlayer1 + player4ExpectedScoreAgainstPlayer2) / 2;
      
        const team1ExpectedScore = (player1ExpectedScore + player2ExpectedScore) / 2;
        const team2ExpectedScore = (player3ExpectedScore + player4ExpectedScore) / 2;

        return {
            player1ExpectedScore, player2ExpectedScore, player3ExpectedScore, player4ExpectedScore, team1ExpectedScore, team2ExpectedScore
        };
    }

    // Fetch player ratings
    async function fetchPlayerRatings(player1Id, player2Id, player3Id, player4Id) {
        try {
            // Fetch ratings for all specified players in one query
            const { data, error } = await supabase
                .from('player')
                .select('player_id, player_rating')
                .in('player_id', [player1Id, player2Id, player3Id, player4Id]);
    
            if (error) throw error;
    
            // Map the results to easily access ratings by player_id
            const ratingsMap = data.reduce((acc, player) => {
                acc[player.player_id] = player.player_rating;
                return acc;
            }, {});
    
            // Extract ratings for each player
            const player1Rating = ratingsMap[player1Id];
            const player2Rating = ratingsMap[player2Id];
            const player3Rating = ratingsMap[player3Id];
            const player4Rating = ratingsMap[player4Id];
    
            return { player1Rating, player2Rating, player3Rating, player4Rating };
        } catch (err) {
            console.error('Error fetching player ratings:', err);
            return { error: err.message };
        }
    }
    
    async function numberOfGamesPlayer(player1Id, player2Id, player3Id, player4Id, date) {
        // Helper function to fetch game count for a single player
        const fetchGameCount = async (playerId) => {
            const { data, error, count } = await supabase
                .from('playermatch')
                .select('match_id', { count: 'exact', head : true }) // Select match_id with an exact count
                .eq('player_id', playerId);
    
            if (error) {
                console.error('Error fetching game count:', error);
                return 0;  // Return 0 on error
            }
            console.log("DEBUG: COUNT CHECK", count);
            return count;
        };
    
        // Concurrently fetch game counts for all players
        // Concurrently fetch game counts for all players
        const numberOfGamesPlayer1 = await fetchGameCount(player1Id);
        const numberOfGamesPlayer2 = await fetchGameCount(player2Id);
        const numberOfGamesPlayer3 = await fetchGameCount(player3Id);
        const numberOfGamesPlayer4 = await fetchGameCount(player4Id);
        console.log("DEBUG: num Games player func pre return:", numberOfGamesPlayer1, numberOfGamesPlayer2, numberOfGamesPlayer3, numberOfGamesPlayer4);
        // Return the number of games played by each player using ES6 shorthand property names
        return {
            numberOfGamesPlayer1,
            numberOfGamesPlayer2,
            numberOfGamesPlayer3,
            numberOfGamesPlayer4
        };
    }


    // Helper for calculating new rating
    function calculateKValue(numberOfGames, baseK = 50, divider = 300) {
        return baseK / (1 + numberOfGames / divider);
    }
    
    // Calculates players new rating 
    function calculateNewRating(currentRating, kValue, actualScore, expectedScore, pointFactor = 1) {
        return currentRating + kValue * pointFactor * (actualScore - expectedScore);
    }

    //Update player ratings
    async function updateRatings(player1Id, player2Id, player3Id, player4Id, scoreDif, date, playerMatchIds) {
        console.log("DEBUG: Param Check: ", player1Id, player2Id, player3Id, player4Id, scoreDif, date);
        // Get player rating
        const { player1Rating, player2Rating, player3Rating, player4Rating } = await fetchPlayerRatings(player1Id, player2Id, player3Id, player4Id);
        const {player1ExpectedScore, player2ExpectedScore, player3ExpectedScore, player4ExpectedScore} = calculateExpectedScores(player1Rating, player2Rating, player3Rating, player4Rating);

        const pointFactor = 2 + (Math.log(scoreDif + 1) / Math.log(10)) ** 3;
        const {numberOfGamesPlayer1, numberOfGamesPlayer2, numberOfGamesPlayer3, numberOfGamesPlayer4} = await numberOfGamesPlayer(player1Id, player2Id, player3Id, player4Id, date);
        console.log("DEBUG: NumGamesPlayer check: ", numberOfGamesPlayer1, numberOfGamesPlayer2, numberOfGamesPlayer3, numberOfGamesPlayer4);
        // Calculate K values for players and teams
        const k1 = calculateKValue(numberOfGamesPlayer1);
        const k2 = calculateKValue(numberOfGamesPlayer2);
        const k3 = calculateKValue(numberOfGamesPlayer3);
        const k4 = calculateKValue(numberOfGamesPlayer4);

        // Determine actual scores based on match results
        const team1ActualScore = teamAScore > teamBScore ? 1 : 0;
        const team2ActualScore = teamAScore > teamBScore ? 0 : 1;

        console.log("DEBUG: ", player1Rating, k1, team1ActualScore, player1ExpectedScore, pointFactor);
        // Calculate new ratings for players and teams
        const player1NewRating = calculateNewRating(player1Rating, k1, team1ActualScore, player1ExpectedScore, pointFactor);
        const player2NewRating = calculateNewRating(player2Rating, k2, team1ActualScore, player2ExpectedScore, pointFactor);
        const player3NewRating = calculateNewRating(player3Rating, k3, team2ActualScore, player3ExpectedScore, pointFactor);
        const player4NewRating = calculateNewRating(player4Rating, k4, team2ActualScore, player4ExpectedScore, pointFactor);

        // Update player ratings in the database
        const playerUpdates = [
            { playerId: player1Id, newRating: player1NewRating },
            { playerId: player2Id, newRating: player2NewRating },
            { playerId: player3Id, newRating: player3NewRating },
            { playerId: player4Id, newRating: player4NewRating }
        ];
        
        // Update current rating in Player
        let i = 0;
        for (const playerUpdate of playerUpdates) {
            console.log("DEBUG: player update:", playerUpdate);
            const {data: updateData, error: updateError} = await supabase
                .from('player')
                .update({ player_rating: parseInt(playerUpdate.newRating) })
                .eq('player_id', playerUpdate.playerId);
            if (updateError) {
                console.error('Error updating player rating:', updateError);
            } else {
                console.log('Successfully updated player rating (player table):', updateData);
            }

            //Insert new rating into PlayerRating
            const { data, error } = await supabase
                .from('playerrating')
                .insert([{
                    player_match_id: playerMatchIds[i],
                    rating: parseInt(playerUpdate.newRating),
                    player_rating_timestamp: date
                }]);
            i++;
            if (error) {
                console.error('Error inserting player rating:', error);
                throw error;
            } else {
                console.log('Successfully inserted player rating (playerrating table):', data);
            }
    }
    }

    try {
        const date = new Date().toISOString();
        // Check or insert players and get their IDs
        const player1Id = await checkOrInsertPlayer(teamAPlayer1);
        const player2Id = await checkOrInsertPlayer(teamAPlayer2);
        const player3Id = await checkOrInsertPlayer(teamBPlayer1);
        const player4Id = await checkOrInsertPlayer(teamBPlayer2);

        // Get or create teams
        const team1Id = await getOrCreateTeam(player1Id, player2Id);
        console.log("team1 ID: ", team1Id)
        const team2Id = await getOrCreateTeam(player3Id, player4Id);
        console.log("team2 ID: ", team2Id)

        if (team1Id == null) {
            console.log("Failed to get/create team1")
            throw new Error('Expected value to not be null');
        }
        if (team2Id == null) {
            console.log("Failed to get/create team1")
            throw new Error('Expected value to not be null');
        }
        console.log("team1ID: ", team1Id);
        console.log("team2ID: ", team2Id);

        // Insert match
        const playerMatchIds = await handleMatchUpdate(player1Id, player2Id, player3Id, player4Id, team1Id, team2Id);
        if (playerMatchIds == null) {
            console.log("Failed to get/create player match IDS")
            throw new Error('Expected value to not be null');
        }
        // Update ratings
        const scoreDif = Math.abs(teamAScore - teamBScore);
        await updateRatings(player1Id, player2Id, player3Id, player4Id, scoreDif, date, playerMatchIds);
        console.log("SUCCESSFULLY INSERTED MATCH :)");
        
    } catch (error) {
        console.error('Error inserting match:', error);
    }
}
