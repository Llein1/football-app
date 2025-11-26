import { useState } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar flex justify-center gap-md" style={{ marginBottom: '2rem' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a team (e.g. Arsenal)..."
                style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    width: '100%',
                    maxWidth: '400px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                Search
            </button>
        </form>
    );
}

export default SearchBar;
