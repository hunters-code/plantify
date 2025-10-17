import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Page Not Found</h2>
      <p style={{ color: '#666', margin: '0 0 24px 0' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href='/'
        style={{
          color: '#0070f3',
          textDecoration: 'none',
          padding: '10px 20px',
          border: '1px solid #0070f3',
          borderRadius: '5px',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
