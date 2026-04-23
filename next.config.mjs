/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

// TODO: wrap with withSentryConfig once Sentry org/project/auth-token are configured.
export default nextConfig;
