import { useState, useEffect, useRef } from 'react';
import CompetitionCard from './components/CompetitionCard';
import TeamCard from './components/TeamCard';
import MatchCard from './components/MatchCard';
import { fetchCompetitions, fetchTeamsByCompetition, fetchMatches } from './services/api';

function App() {
  const matchRefs = useRef([]);
  const [view, setView] = useState('competitions'); // 'competitions' | 'teams' | 'matches'
  const [competitions, setCompetitions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Load competitions on mount
  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompetitions();
      setCompetitions(data);
    } catch (err) {
      setError('Failed to load competitions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompetition = async (competitionId) => {
    const competition = competitions.find(c => c.id === competitionId);
    setSelectedCompetition(competition);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTeamsByCompetition(competitionId);
      setTeams(data);
      setView('teams');
    } catch (err) {
      setError('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = async (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setSelectedTeam(team);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatches(teamId);
      setMatches(data);
      setView('matches');
    } catch (err) {
      setError('Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to match closest to today when matches are loaded
  useEffect(() => {
    if (view === 'matches' && matches.length > 0 && matchRefs.current.length > 0) {
      const now = new Date();

      // Find the index of the match closest to today
      let closestIndex = 0;
      let minDiff = Math.abs(new Date(matches[0].utcDate) - now);

      matches.forEach((match, index) => {
        const diff = Math.abs(new Date(match.utcDate) - now);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      // Disable hover during scroll
      setIsScrolling(true);

      // Scroll to that match
      if (matchRefs.current[closestIndex]) {
        setTimeout(() => {
          matchRefs.current[closestIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // Re-enable hover after scroll animation (smooth scroll takes ~500-1000ms)
          setTimeout(() => {
            setIsScrolling(false);
          }, 1000);
        }, 100);
      }
    }
  }, [view, matches]);

  const handleBack = () => {
    if (view === 'matches') {
      setView('teams');
      setSelectedTeam(null);
      setMatches([]);
    } else if (view === 'teams') {
      setView('competitions');
      setSelectedCompetition(null);
      setTeams([]);
    }
  };

  return (
    <div className="container">
      <header className="text-center" style={{ padding: '4rem 0 2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          <span className="text-primary">Football</span> Stats
        </h1>
        <p className="text-muted">
          {view === 'competitions' && 'Select a competition to explore'}
          {view === 'teams' && `Teams in ${selectedCompetition?.name}`}
          {view === 'matches' && `Matches for ${selectedTeam?.name}`}
        </p>
      </header>

      <main className="flex flex-col items-center">
        {loading && (
          <div className="text-center text-muted" style={{ margin: '2rem' }}>
            Loading...
          </div>
        )}

        {error && (
          <div className="text-center" style={{ color: 'var(--color-error)', margin: '2rem' }}>
            {error}
          </div>
        )}

        {/* Back Button - Sticky */}
        {(view === 'teams' || view === 'matches') && (
          <button
            onClick={handleBack}
            className="text-muted hover:text-primary"
            style={{
              position: 'sticky',
              top: '4rem',
              left: '0',
              zIndex: 10,
              fontSize: '1rem',
              cursor: 'pointer',
              background: 'var(--color-surface)',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 1rem',
              marginBottom: '2rem',
              marginLeft: view === 'matches' ? '0' : '-11rem', // Matches: sağda, Teams: solda
              alignSelf: 'flex-start',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            ← Back
          </button>
        )}

        {/* Competitions View */}
        {view === 'competitions' && !loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              width: '100%',
              maxWidth: '1200px'
            }}
          >
            {competitions.map(competition => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                onSelect={handleSelectCompetition}
              />
            ))}
          </div>
        )}

        {/* Teams View */}
        {view === 'teams' && !loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
              width: '100%',
              maxWidth: '1200px'
            }}
          >
            {teams.map(team => (
              <TeamCard key={team.id} team={team} onSelect={handleSelectTeam} />
            ))}
          </div>
        )}

        {/* Matches View */}
        {view === 'matches' && !loading && (
          <div className="flex flex-col gap-md" style={{ width: '100%', maxWidth: '800px' }}>
            {matches.length > 0 ? (
              (() => {
                // Find index of first TIMED (upcoming) match
                const firstTimedIndex = matches.findIndex(m => m.status === 'TIMED');

                return matches.map((match, index) => (
                  <div key={match.id} ref={(el) => matchRefs.current[index] = el}>
                    <MatchCard
                      match={match}
                      isHighlighted={index === firstTimedIndex}
                      isScrolling={isScrolling}
                    />
                  </div>
                ));
              })()
            ) : (
              <p className="text-center text-muted">No matches found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
