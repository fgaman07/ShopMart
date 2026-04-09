import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer'; // Keeping original import but will rewrite it

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-inter text-secondary">
      <Header />
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
