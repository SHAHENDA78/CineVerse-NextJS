'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchMovieDetails, IMAGE_BASE, BACKDROP_BASE } from '../../../api/movies';
import { useFav } from '../../../context/FavContext';

export default function DetailsPage() {
  const { id }                = useParams();
  const router                = useRouter();
  const { isFav, toggleFav } = useFav();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMovieDetails(id);
        setDetails(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div style={s.centered}>
      <div style={s.spinner} />
      <p style={s.mutedTxt}>Loading movie...</p>
    </div>
  );

  if (error || !details) return (
    <div style={s.centered}>
      <p style={s.errorTxt}>⚠️ {error || 'Movie not found'}</p>
      <button style={s.backBtn} onClick={() => router.back()}>← Go Back</button>
    </div>
  );

  const favd       = isFav(details.id);
  const backdropUrl = details.backdrop_path ? `${BACKDROP_BASE}${details.backdrop_path}` : null;
  const posterUrl   = details.poster_path   ? `${IMAGE_BASE}${details.poster_path}`      : null;
  const cast        = details.credits?.cast?.slice(0, 10) || [];

  return (
    <div style={s.page}>
      <div style={{
        ...s.backdrop,
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
      }}>
        <div style={s.backdropOverlay} />
        <div style={s.backdropActions}>
          <button style={s.pill} onClick={() => router.back()}>← Back</button>
          <button
            style={{ ...s.pill, ...(favd ? s.pillRed : {}) }}
            onClick={() => toggleFav(details)}
          >
            {favd ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.topRow}>
          {posterUrl && (
            <img src={posterUrl} alt={details.title} style={s.poster} />
          )}

          <div style={s.infoBlock}>
            <h1 style={s.title}>{details.title}</h1>

            <div style={s.metaRow}>
              <span>⭐ <b style={s.gold}>{details.vote_average?.toFixed(1)}</b></span>
              <span style={s.dot}>·</span>
              <span style={s.muted}>{details.release_date?.slice(0, 4)}</span>
              {details.runtime && (
                <>
                  <span style={s.dot}>·</span>
                  <span style={s.muted}>⏱ {details.runtime} min</span>
                </>
              )}
            </div>

            {details.genres?.length > 0 && (
              <div style={s.genresRow}>
                {details.genres.map((g) => (
                  <span key={g.id} style={s.genreBadge}>{g.name}</span>
                ))}
              </div>
            )}

            <p style={s.overview}>{details.overview || 'No description available.'}</p>

            <button
              style={{ ...s.bigFavBtn, ...(favd ? s.bigFavBtnOff : {}) }}
              onClick={() => toggleFav(details)}
            >
              {favd ? '💔 Remove from Favourites' : '❤️ Add to Favourites'}
            </button>
          </div>
        </div>

        {cast.length > 0 && (
          <div>
            <h2 style={s.sectionLabel}>Top Cast</h2>
            <div style={s.castRow}>
              {cast.map((actor) => (
                <div key={actor.id} style={s.castCard}>
                  {actor.profile_path
                    ? <img src={`${IMAGE_BASE}${actor.profile_path}`} alt={actor.name} style={s.castImg} />
                    : <div style={s.castPlaceholder}>👤</div>
                  }
                  <p style={s.castName}>{actor.name}</p>
                  <p style={s.castRole}>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  centered:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 },
  spinner:   { width: 40, height: 40, borderRadius: '50%', border: '3px solid #1c1c2a', borderTop: '3px solid #E63946' },
  mutedTxt:  { color: '#6E6D7A', fontSize: 14 },
  errorTxt:  { color: '#E63946', fontSize: 16 },
  backBtn:   { backgroundColor: '#1C1C2A', color: '#F0EFF4', border: 'none', borderRadius: 20, padding: '10px 24px', cursor: 'pointer', fontWeight: 700 },

  page:            { backgroundColor: '#0A0A0F', minHeight: '100vh' },
  backdrop:        { width: '100%', height: 320, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1c1c2a', position: 'relative' },
  backdropOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,15,0.6)' },
  backdropActions: { position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' },
  pill:      { backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' },
  pillRed:   { backgroundColor: '#E63946' },

  content:   { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  topRow:    { display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 },
  poster:    { width: 200, borderRadius: 16, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' },
  infoBlock: { flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14 },
  title:     { color: '#F0EFF4', fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.3 },
  metaRow:   { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 },
  gold:      { color: '#FFD60A' },
  dot:       { color: '#444' },
  muted:     { color: '#6E6D7A' },
  genresRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  genreBadge:{ backgroundColor: 'rgba(230,57,70,0.12)', color: '#E63946', border: '1px solid rgba(230,57,70,0.25)', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 },
  overview:  { color: '#9E9DAA', fontSize: 14, lineHeight: 1.7, margin: 0 },
  bigFavBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#E63946', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15 },
  bigFavBtnOff: { backgroundColor: '#2a2a3a' },

  sectionLabel:    { color: '#F0EFF4', fontSize: 18, fontWeight: 800, marginBottom: 16 },
  castRow:         { display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 },
  castCard:        { flexShrink: 0, width: 80, textAlign: 'center' },
  castImg:         { width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 6px' },
  castPlaceholder: { width: 64, height: 64, borderRadius: '50%', backgroundColor: '#1c1c2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 6px' },
  castName:        { color: '#F0EFF4', fontSize: 11, fontWeight: 600, margin: '0 0 2px' },
  castRole:        { color: '#6E6D7A', fontSize: 10, margin: 0 },
};