const BASE_URL = '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
    'X-Auth-Token': API_KEY,
};

export const fetchCompetitions = async () => {
    try {
        const response = await fetch(`${BASE_URL}/competitions`, { headers });
        if (!response.ok) throw new Error('Failed to fetch competitions');
        const data = await response.json();
        return data.competitions;
    } catch (error) {
        console.error('Error fetching competitions:', error);
        throw error;
    }
};

export const fetchTeamsByCompetition = async (competitionId) => {
    try {
        const response = await fetch(`${BASE_URL}/competitions/${competitionId}/teams`, { headers });
        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();
        return data.teams || [];
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};

export const fetchTeams = async (query) => {
    if (!query) return [];
    console.log('Fetching teams with query:', query);

    try {
        // Fetch teams from all competitions in parallel
        const promises = COMPETITION_IDS.map(async (competitionId) => {
            try {
                const response = await fetch(`${BASE_URL}/competitions/${competitionId}/teams`, { headers });
                if (!response.ok) return [];
                const data = await response.json();
                return data.teams || [];
            } catch (err) {
                console.warn(`Failed to fetch competition ${competitionId}:`, err);
                return [];
            }
        });

        const results = await Promise.all(promises);
        const allTeams = results.flat();

        // Remove duplicates by team ID
        const uniqueTeams = Array.from(
            new Map(allTeams.map(team => [team.id, team])).values()
        );

        console.log('Total teams fetched:', uniqueTeams.length);

        // Client-side filtering by team name
        const filteredTeams = uniqueTeams.filter(team =>
            team.name.toLowerCase().includes(query.toLowerCase()) ||
            team.shortName?.toLowerCase().includes(query.toLowerCase()) ||
            team.tla?.toLowerCase().includes(query.toLowerCase())
        );

        console.log('Filtered teams:', filteredTeams.length);
        return filteredTeams;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};

export const fetchMatches = async (teamId) => {
    if (!teamId) return [];
    try {
        // Fetch more matches (up to 50) to get a better range
        const response = await fetch(`${BASE_URL}/teams/${teamId}/matches?limit=50`, { headers });
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();

        // Sort matches by date (oldest first, newest last)
        const sortedMatches = (data.matches || []).sort((a, b) => {
            const dateA = new Date(a.utcDate);
            const dateB = new Date(b.utcDate);
            return dateA - dateB; // Ascending order (oldest first)
        });

        return sortedMatches;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
};
