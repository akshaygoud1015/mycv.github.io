/** @type {import('next').NextConfig} */

// GitHub Pages project sites are served from /<repo>/. Set NEXT_PUBLIC_BASE_PATH
// to "/mycv.github.io" for that. Leave empty for a root/custom-domain deploy.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
