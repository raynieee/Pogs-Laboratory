/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  distDir: 'build',
  output: 'export'
};

export default nextConfig;
