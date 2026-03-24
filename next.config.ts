import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/reactflow-funil-de-trafego',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
