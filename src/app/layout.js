
import { FavProvider } from '../context/FavContext';
import Navbar          from '../components/Navbar';

export const metadata = {
  title:       'CineVerse',
  description: 'Browse & save your favourite movies',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0, padding: 0,
        backgroundColor: '#0A0A0F',
        color: '#F0EFF4',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <FavProvider>
          <Navbar />
          <main>{children}</main>
        </FavProvider>
      </body>
    </html>
  );
}