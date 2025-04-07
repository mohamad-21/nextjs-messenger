/** @type {import('next').NextConfig} */
const nextConfig = {
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
