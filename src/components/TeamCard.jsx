function TeamCard({ team, onSelect }) {
    return (
        <div
            className="card"
            onClick={() => onSelect(team.id)}
            style={{
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem',
                gap: '0.75rem'
            }}
        >
            {team.crest ? (
                <img
                    src={team.crest}
                    alt={team.name}
                    style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain'
                    }}
                />
            ) : (
                <div style={{ fontSize: '3rem' }}>⚽</div>
            )}
            <div>
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {team.shortName || team.name}
                </div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {team.venue || team.area?.name || 'N/A'}
                </div>
            </div>
        </div>
    );
}

export default TeamCard;
