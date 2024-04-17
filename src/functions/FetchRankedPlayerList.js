import { supabase } from "../Supabase";

export async function fetchRankedPlayerList() {
    try {
        // Query the player table and order by player_rating in descending order
        const { data, error } = await supabase
            .from('player')
            .select('player_name, player_rating')
            .order('player_rating', { ascending: false });

        if (error) {
            console.error('Error fetching ranked players:', error);
            throw error;  // Throw the error to be handled by the caller
        }

        return data;  // Return the array of {player_name, player_rating} objects
    } catch (error) {
        // Log and re-throw any errors caught during the execution
        console.error('Failed to fetch ranked player list:', error);
        throw error;
    }
}
