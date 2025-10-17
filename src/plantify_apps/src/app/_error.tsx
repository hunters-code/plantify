'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

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
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            margin: '0 0 16px 0',
            color: '#dc2626',
            fontWeight: 'bold',
          }}
        >
          500
        </h1>
        <h2
          style={{
            fontSize: '24px',
            margin: '0 0 8px 0',
            color: '#374151',
            fontWeight: '600',
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            color: '#6b7280',
            margin: '0 0 24px 0',
            lineHeight: '1.5',
          }}
        >
          An unexpected error occurred while processing your request. Please try
          again or contact support if the problem persists.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={reset}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            Go Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error.message && (
          <details
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              textAlign: 'left',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}
            >
              Error Details (Development)
            </summary>
            <pre
              style={{
                fontSize: '12px',
                color: '#dc2626',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
              }}
            >
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
