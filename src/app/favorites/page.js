'use client';

import { useState, useMemo } from 'react';
import MovieCard    from '../../components/MovieCard';
import SearchFilter from '../../components/SearchFilter';
import { useFav }   from '../../context/FavContext';

const TABS = ['All', 'EN', 'Other'];

export default function FavoritesPage() {
  const { favourites, removeFav } = useFav();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab]     = useState('All');

  const filtered = useMemo(() => favourites.filter((m) => {
    const matchSearch =
      !searchQuery.trim() ||
      m.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab =
      activeTab === 'All' ||
      (activeTab === 'EN'    && m.original_language === 'en') ||
      (activeTab === 'Other' && m.original_language !== 'en');
    return matchSearch && matchTab;
  }), [favourites, searchQuery, activeTab]);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerRow}>
          <h1 style={s.title}>MY <span style={s.accent}>FAVS</span></h1>
          {favourites.length > 0 && (
            <span style={s.countBadge}>{favourites.length}</span>
          )}
        </div>
        <p style={s.subtitle}>Showing {filtered.length} of {favourites.length}</p>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={false}
        placeholder="Search your favourites..."
      />

      <div style={s.tabsRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={s.emptyWrap}>
          <span style={s.emptyIcon}>{favourites.length === 0 ? '💔' : '🔎'}</span>
          <p style={s.emptyTitle}>
            {favourites.length === 0 ? 'No favourites yet' : 'No matches'}
          </p>
          <p style={s.emptySub}>
            {favourites.length === 0
              ? 'Go to Home and click ❤️ on any movie'
              : 'Try a different filter or search'}
          </p>
        </div>
      )}

      <div>
        {filtered.map((movie) => (
          <div key={movie.id} style={s.itemWrap}>
            <MovieCard movie={movie} variant="list" />
            <button
              style={s.deleteBtn}
              onClick={() => removeFav(movie.id)}
              title="Remove from favourites"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page:       { maxWidth: 800, margin: '0 auto', padding: '28px 24px' },
  header:     { marginBottom: 20 },
  headerRow:  { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 },
  title:      { color: '#F0EFF4', fontSize: 28, fontWeight: 900, letterSpacing: 2, margin: 0 },
  accent:     { color: '#E63946' },
  countBadge: {
    backgroundColor: '#E63946', color: '#fff',
    borderRadius: 12, padding: '3px 10px',
    fontSize: 13, fontWeight: 800,
  },
  subtitle:  { color: '#6E6D7A', fontSize: 13, margin: 0 },
  tabsRow:   { display: 'flex', gap: 8, marginBottom: 20 },
  tab: {
    padding: '7px 20px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: '#1C1C2A', color: '#6E6D7A',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  tabActive:  { backgroundColor: '#E63946', borderColor: '#E63946', color: '#fff' },
  emptyWrap:  { textAlign: 'center', padding: '80px 0' },
  emptyIcon:  { fontSize: 60 },
  emptyTitle: { color: '#F0EFF4', fontSize: 18, fontWeight: 700, marginTop: 16 },
  emptySub:   { color: '#6E6D7A', fontSize: 14, lineHeight: 1.6 },
  itemWrap:   { position: 'relative' },
  deleteBtn: {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)',
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(230,57,70,0.1)',
    border: '1px solid rgba(230,57,70,0.25)',
    cursor: 'pointer', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};