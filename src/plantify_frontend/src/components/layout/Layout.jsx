import { Footer, Navbar } from '..';

export default function Layout({ children }) {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <Navbar />
      <main className='p-6'>{children}</main>
      <Footer />
    </div>
  );
}
