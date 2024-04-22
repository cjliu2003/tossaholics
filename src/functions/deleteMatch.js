import { supabase } from "../Supabase";

const fetchPlayerMatches = async (match_id) => {
    let query = supabase.from('playermatch').select('player_match_id, player_id');
    if (match_id !== null) {
        query = query.eq('match_id', match_id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

const recalculateRating = async (player_id, excludeMatchId) => {
    try {
        const allPlayerMatches = await fetchPlayerMatches(null); // Fetch all matches
        const filteredMatches = allPlayerMatches.filter(pm => pm.player_id === player_id && pm.match_id !== excludeMatchId);
        const playerMatchIds = filteredMatches.map(pm => pm.player_match_id);

        const { data: ratingsData } = await supabase
            .from('playerrating')
            .select('rating')
            .in('player_match_id', playerMatchIds);

        if (ratingsData.length === 0) return { newRating: null, message: "No ratings to recalculate." };

        const averageRating = ratingsData.reduce((acc, { rating }) => acc + rating, 0) / ratingsData.length;

        await supabase
            .from('player')
            .update({ rating: averageRating })
            .eq('player_id', player_id);

        return { newRating: averageRating, message: "Rating recalculated successfully." };
    } catch (error) {
        console.error('Failed to recalculate rating:', error);
        return { error: error.message };
    }
};

export const removeMatch = async (match_id) => {
    try {
        const playerMatches = await fetchPlayerMatches(match_id);

        for (const { player_match_id, player_id } of playerMatches) {
            await supabase.from('playerrating').delete().eq('player_match_id', player_match_id);
            await recalculateRating(player_id, match_id);
        }

        await supabase.from('playermatch').delete().eq('match_id', match_id);
        await supabase.from('match').delete().eq('match_id', match_id);

        return { message: "Match and associated data successfully removed and ratings recalculated." };
    } catch (error) {
        console.error('Failed to remove match:', error);
        return { error: error.message };
    }
};

