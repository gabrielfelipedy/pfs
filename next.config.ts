import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/operations/limites",
        destination: "/dashboard/limites",
        permanent: true,
      },
      {
        source: "/operations/credit",
        destination: "/dashboard/credit",
        permanent: true,
      },
      {
        source: "/operations",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
