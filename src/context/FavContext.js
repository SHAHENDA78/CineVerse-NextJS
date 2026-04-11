'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FavContext = createContext();

export const FavProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [hydrated, setHydrated]     = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cineverse_favs');
      if (stored) setFavourites(JSON.parse(stored));
    } catch (e) {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated)
      localStorage.setItem('cineverse_favs', JSON.stringify(favourites));
  }, [favourites, hydrated]);

  const addFav    = (m) => setFavourites((p) => p.find((x) => x.id === m.id) ? p : [...p, m]);
  const removeFav = (id) => setFavourites((p) => p.filter((x) => x.id !== id));
  const isFav     = (id) => favourites.some((x) => x.id === id);
  const toggleFav = (m)  => isFav(m.id) ? removeFav(m.id) : addFav(m);

  return (
    <FavContext.Provider value={{ favourites, addFav, removeFav, isFav, toggleFav }}>
      {children}
    </FavContext.Provider>
  );
};

export const useFav = () => useContext(FavContext);