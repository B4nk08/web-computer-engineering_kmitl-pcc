import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

// โหลด .env จาก root โปรเจกต์ (ไฟล์เดียวทั้งระบบ)
loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/beng", destination: "/about-us/beng", permanent: true },
      {
        source: "/admission-requirements",
        destination: "/about-us/admission-requirements",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
