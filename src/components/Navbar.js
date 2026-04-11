'use client';

import Link        from 'next/link';
import { usePathname } from 'next/navigation';
import { useFav }  from '../context/FavContext';

export default function Navbar() {
  const pathname       = usePathname();
  const { favourites } = useFav();

  const isHome = pathname === '/';
  const isFavs = pathname === '/favorites';

  return (
    <nav style={s.nav}>
      <Link href="/" style={s.logo}>
        CINE<span style={s.accent}>VERSE</span>
      </Link>

      <div style={s.links}>
        <Link href="/" style={{ ...s.link, ...(isHome ? s.linkActive : {}) }}>
          🎬 Home
        </Link>
        <Link href="/favorites" style={{ ...s.link, ...(isFavs ? s.linkActive : {}) }}>
          ❤️ Favourites
          {favourites.length > 0 && (
            <span style={s.badge}>{favourites.length}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 32px',
    backgroundColor: '#13131C',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontSize: 22, fontWeight: 900, letterSpacing: 3,
    color: '#F0EFF4', textDecoration: 'none',
  },
  accent: { color: '#E63946' },
  links:  { display: 'flex', gap: 24, alignItems: 'center' },
  link: {
    color: '#6E6D7A', textDecoration: 'none',
    fontWeight: 600, fontSize: 14,
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'color .2s',
  },
  linkActive: { color: '#E63946' },
  badge: {
    backgroundColor: '#E63946', color: '#fff',
    borderRadius: 12, padding: '2px 8px',
    fontSize: 11, fontWeight: 800, marginLeft: 4,
  },
};