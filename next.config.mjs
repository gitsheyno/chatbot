/** @type {import('next').NextConfig} */
const nextConfig = {
    serverComponentsExternalPackages: ["pdf-parse"],
    test: {
        environment: "happy-dom",
      }
};

export default nextConfig;
