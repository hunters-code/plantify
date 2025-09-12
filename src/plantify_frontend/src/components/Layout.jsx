export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b p-4">Navbar</header>
      <main className="p-6">{children}</main>
      <footer className="border-t p-4 text-sm text-gray-500">Footer</footer>
    </div>
  );
}