'use client';

import { useState, useEffect, useCallback } from 'react';
import MovieCard    from '../components/MovieCard';
import SearchFilter from '../components/SearchFilter';
import { fetchMovies, searchMovies } from '../api/movies';

export default function HomePage() {
  const [movies, setMovies]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadingMore, setLoadingMore]     = useState(false);
  const [error, setError]                 = useState(null);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [activeFilter, setActiveFilter]   = useState('popular');
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]     = useState(false);

  const loadMovies = useCallback(async (filter, pg = 1) => {
    pg === 1 ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const data = await fetchMovies(filter, pg);
      setMovies((prev) => pg === 1 ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(pg);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      loadMovies(activeFilter, 1);
    }
  }, [activeFilter]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchMovies(searchQuery);
        setSearchResults(data.results || []);
      } catch (e) {}
      finally { setIsSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setSearchQuery('');
    setSearchResults([]);
    setMovies([]);
    setPage(1);
  };

  const displayMovies = searchQuery ? searchResults : movies;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <p style={s.greeting}>Good evening 👋</p>
        <h1 style={s.title}>CINE<span style={s.accent}>VERSE</span></h1>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isSearching}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        showFilters={!searchQuery}
        placeholder="Search movies, genres..."
      />

      {displayMovies.length > 0 && (
        <p style={s.count}>{displayMovies.length} titles found</p>
      )}

      {error && !loading && (
        <div style={s.errorBox}>
          <p style={s.errorTxt}>⚠️ {error}</p>
          <button style={s.retryBtn} onClick={() => loadMovies(activeFilter, 1)}>
            Retry
          </button>
        </div>
      )}

      {loading && movies.length === 0 && !searchQuery
        ? (
          <div style={s.centered}>
            <div style={s.spinner} />
            <p style={s.mutedTxt}>Fetching movies...</p>
          </div>
        ) : (
          <>
            <div style={s.grid}>
              {displayMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="grid" />
              ))}
            </div>

            {!loading && displayMovies.length === 0 && !error && (
              <div style={s.centered}>
                <span style={s.bigIcon}>🎭</span>
                <p style={s.emptyTitle}>No movies found</p>
                <p style={s.mutedTxt}>Try a different search or filter</p>
              </div>
            )}

            {!searchQuery && page < totalPages && (
              <div style={s.loadMoreWrap}>
                <button
                  style={s.loadMoreBtn}
                  onClick={() => loadMovies(activeFilter, page + 1)}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )
      }
    </div>
  );
}

const s = {
  page:     { maxWidth: 1200, margin: '0 auto', padding: '28px 24px' },
  header:   { marginBottom: 24 },
  greeting: { color: '#6E6D7A', fontSize: 13, margin: '0 0 4px' },
  title:    { color: '#F0EFF4', fontSize: 32, fontWeight: 900, letterSpacing: 3, margin: 0 },
  accent:   { color: '#E63946' },
  count:    { color: '#6E6D7A', fontSize: 13, marginBottom: 16 },
  errorBox: { textAlign: 'center', padding: 40 },
  errorTxt: { color: '#E63946', marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#E63946', color: '#fff',
    border: 'none', borderRadius: 20,
    padding: '10px 28px', cursor: 'pointer', fontWeight: 700,
  },
  centered: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '80px 0', gap: 16,
  },
  spinner: {
    width: 40, height: 40, borderRadius: '50%',
    border: '3px solid #1c1c2a', borderTop: '3px solid #E63946',
    animation: 'spin 0.8s linear infinite',
  },
  bigIcon:    { fontSize: 60 },
  emptyTitle: { color: '#F0EFF4', fontSize: 18, fontWeight: 700 },
  mutedTxt:   { color: '#6E6D7A', fontSize: 14 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
    gap: 16, marginBottom: 32,
  },
  loadMoreWrap: { textAlign: 'center', marginBottom: 40 },
  loadMoreBtn: {
    backgroundColor: '#1C1C2A', color: '#F0EFF4',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: '12px 36px',
    cursor: 'pointer', fontWeight: 700, fontSize: 14,
    transition: 'all .2s',
  },
};
