'use client';
import { FILTERS } from '../api/movies';

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  isSearching   = false,
  activeFilter,
  onFilterChange,
  showFilters   = true,
  placeholder   = 'Search movies...',
}) {
  return (
    <div style={s.wrapper}>
      <div style={s.bar}>
        <span style={s.icon}>🔍</span>
        <input
          style={s.input}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {isSearching
          ? <span>⏳</span>
          : searchQuery && (
              <button style={s.clear} onClick={() => onSearchChange('')}>✕</button>
            )
        }
      </div>

      {showFilters && (
        <div style={s.chips}>
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                style={{ ...s.chip, ...(active ? s.chipActive : {}) }}
                onClick={() => onFilterChange(f.key)}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  bar: {
    display: 'flex', alignItems: 'center', gap: 10,
    backgroundColor: '#1C1C2A', borderRadius: 14,
    padding: '11px 16px',
    border: '1px solid rgba(255,255,255,0.07)',
  },
  icon:  { fontSize: 16, color: '#6E6D7A' },
  input: {
    flex: 1, background: 'none', border: 'none',
    outline: 'none', color: '#F0EFF4', fontSize: 14, width: '100%',
  },
  clear: {
    background: 'none', border: 'none',
    color: '#6E6D7A', cursor: 'pointer', fontSize: 14, padding: 0,
  },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip: {
    padding: '7px 18px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: '#1C1C2A', color: '#6E6D7A',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    transition: 'all .2s',
  },
  chipActive: { backgroundColor: '#E63946', borderColor: '#E63946', color: '#fff' },
};