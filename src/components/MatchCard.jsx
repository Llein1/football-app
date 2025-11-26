function MatchCard({ match, isHighlighted = false, isScrolling = false }) {
    const date = new Date(match.utcDate).toLocaleString('tr-TR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Istanbul' // UTC+3
    });

    const isFinished = match.status === 'FINISHED';
    const score = isFinished ? `${match.score.fullTime.home} - ${match.score.fullTime.away}` : '-';

    return (
        <div
            className="card flex flex-col gap-md"
            style={{
                minWidth: '300px',
                border: isHighlighted ? '2px solid var(--color-primary)' : undefined,
                boxShadow: isHighlighted ? '0 4px 12px rgba(var(--color-primary-rgb), 0.2)' : undefined,
                pointerEvents: isScrolling ? 'none' : 'auto',
                transition: isScrolling ? 'none' : 'all var(--transition-fast)'
            }}
        >
            <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.875rem' }}>
                <span>{match.competition.name}</span>
                <span>{date}</span>
            </div>

            <div className="flex justify-between items-center" style={{ margin: '1rem 0' }}>
                <div className="flex flex-col items-center gap-md" style={{ flex: 1 }}>
                    {match.homeTeam.crest && (
                        <img src={match.homeTeam.crest} alt={match.homeTeam.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    )}
                    <span className="text-center" style={{ fontWeight: '600' }}>{match.homeTeam.shortName || match.homeTeam.name}</span>
                </div>

                <div className="flex flex-col items-center justify-center" style={{ padding: '0 1rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: '800', color: isFinished ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                        {isFinished ? score : 'VS'}
                    </span>
                    <span className="text-primary" style={{ fontSize: '0.75rem', fontWeight: '600', marginTop: '0.5rem' }}>
                        {match.status}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-md" style={{ flex: 1 }}>
                    {match.awayTeam.crest && (
                        <img src={match.awayTeam.crest} alt={match.awayTeam.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    )}
                    <span className="text-center" style={{ fontWeight: '600' }}>{match.awayTeam.shortName || match.awayTeam.name}</span>
                </div>
            </div>
        </div>
    );
}

export default MatchCard;
