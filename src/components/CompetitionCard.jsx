import worldCupLogo from '../assets/worldcup.png';

function CompetitionCard({ competition, onSelect }) {
    return (
        <div
            className="card"
            onClick={() => onSelect(competition.id)}
            style={{
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem',
                gap: '0.75rem'
            }}
        >
            {competition.code === 'WC' ? (
                <img
                    src={worldCupLogo}
                    alt="FIFA World Cup"
                    style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain'
                    }}
                />
            ) : competition.emblem ? (
                <img
                    src={competition.emblem}
                    alt={competition.name}
                    style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'contain'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            ) : (
                <div style={{ fontSize: '3rem' }}>⚽</div>
            )}
            <div>
                <div style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    {competition.name}
                </div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {competition.area?.name || 'International'}
                </div>
            </div>
        </div>
    );
}

export default CompetitionCard;
