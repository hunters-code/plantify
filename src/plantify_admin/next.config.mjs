/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mjsxomsqxrlhoqtdgkds.storage.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/Plantify/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
