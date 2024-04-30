import { supabase } from "../Supabase";

export const fetchPlayerRatingFromPlayerName = async (player_name) => {
    try {
        // Perform a query on the 'players' table
        const { data, error } = await supabase
            .from('player')
            .select('player_rating')
            .eq('player_name', player_name)
            .single(); // Assumes playerId is unique and you expect only one result

        // If there's an error, throw it to be handled by the caller
        if (error) throw error;

        // Return the player rating
        return data.player_rating;
    } catch (error) {
        // Log or handle error appropriately in real scenarios
        console.error('Error fetching player rating:', error.message);
        return null; // You might want to return null or handle the error differently depending on your app's needs
    }
}
