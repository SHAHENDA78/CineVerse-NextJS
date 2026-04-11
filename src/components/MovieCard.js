'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IMAGE_BASE } from '../api/movies';
import { useFav }  from '../context/FavContext';

export default function MovieCard({ movie, variant = 'grid' }) {
  const { isFav, toggleFav } = useFav();
  const [imgErr, setImgErr]  = useState(false);
  const favd    = isFav(movie.id);
  const poster  = movie.poster_path && !imgErr
    ? `${IMAGE_BASE}${movie.poster_path}` : null;

  if (variant === 'list') {
    return (
      <div style={s.listCard}>
        <Link href={`/movie/${movie.id}`} style={s.listThumb}>
          {poster
            ? <img src={poster} alt={movie.title} style={s.listImg} onError={() => setImgErr(true)} />
            : <div style={s.noImgSm}>🎬</div>
          }
        </Link>

        <div style={s.listInfo}>
          <Link href={`/movie/${movie.id}`} style={s.plainLink}>
            <p style={s.listTitle}>{movie.title}</p>
          </Link>
          <div style={s.metaRow}>
            <span>⭐ <b style={s.gold}>{movie.vote_average?.toFixed(1)}</b></span>
            <span style={s.dot}>·</span>
            <span style={s.muted}>{movie.release_date?.slice(0, 4) || '—'}</span>
          </div>
          <span style={s.badge}>
            {movie.original_language?.toUpperCase()} · {movie.adult ? '18+' : 'PG'}
          </span>
        </div>

        <button style={s.heartBtn} onClick={() => toggleFav(movie)}>❤️</button>
      </div>
    );
  }

  return (
    <div style={s.gridCard}>
      <div style={s.posterWrap}>
        <Link href={`/movie/${movie.id}`}>
          {poster
            ? <img src={poster} alt={movie.title} style={s.poster} onError={() => setImgErr(true)} />
            : <div style={s.noImgLg}>🎬</div>
          }
        </Link>

        <div style={s.ratingBadge}>
          ⭐ <span style={s.gold}>{movie.vote_average?.toFixed(1)}</span>
        </div>

        <button
          style={{ ...s.favBtn, ...(favd ? s.favBtnOn : {}) }}
          onClick={() => toggleFav(movie)}
          title={favd ? 'Remove' : 'Save'}
        >
          {favd ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={s.gridInfo}>
        <Link href={`/movie/${movie.id}`} style={s.plainLink}>
          <p style={s.gridTitle}>{movie.title}</p>
        </Link>
        <span style={s.muted}>{movie.release_date?.slice(0, 4) || '—'}</span>
      </div>
    </div>
  );
}

const s = {
  plainLink: { textDecoration: 'none' },
  gold:      { color: '#FFD60A' },
  muted:     { color: '#6E6D7A', fontSize: 12 },
  dot:       { color: '#444' },

  gridCard: {
    backgroundColor: '#16161F', borderRadius: 16, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'transform .2s',
  },
  posterWrap: { position: 'relative' },
  poster:     { width: '100%', height: 260, objectFit: 'cover', display: 'block' },
  noImgLg: {
    width: '100%', height: 260, backgroundColor: '#1c1c2a',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
  },
  ratingBadge: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700,
    color: '#fff', display: 'flex', alignItems: 'center', gap: 4,
  },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32, borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    border: 'none', cursor: 'pointer', fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .2s',
  },
  favBtnOn: { backgroundColor: '#E63946' },
  gridInfo: { padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  gridTitle: {
    color: '#F0EFF4', fontSize: 13, fontWeight: 600,
    margin: 0, lineHeight: 1.4,
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },

  listCard: {
    display: 'flex', alignItems: 'center', gap: 14,
    backgroundColor: '#16161F', borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.06)',
    padding: 12, marginBottom: 12,
  },
  listThumb: { flexShrink: 0, borderRadius: 10, overflow: 'hidden', textDecoration: 'none' },
  listImg:   { width: 62, height: 80, objectFit: 'cover', display: 'block', borderRadius: 10 },
  noImgSm: {
    width: 62, height: 80, backgroundColor: '#1c1c2a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, borderRadius: 10,
  },
  listInfo:  { flex: 1, display: 'flex', flexDirection: 'column', gap: 5 },
  listTitle: { color: '#F0EFF4', fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.4 },
  metaRow:   { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(244,162,97,0.12)',
    color: '#F4A261', fontSize: 10, fontWeight: 700,
    padding: '3px 8px', borderRadius: 6, letterSpacing: 0.5,
  },
  heartBtn: {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    backgroundColor: 'rgba(230,57,70,0.1)',
    border: '1px solid rgba(230,57,70,0.25)',
    cursor: 'pointer', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};