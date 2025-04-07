/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https"
      }
    ]
  },
  // experimental: {
  //   staleTimes: {
  //     dynamic: 0,
  //   }
  // }
};

export default nextConfig;
