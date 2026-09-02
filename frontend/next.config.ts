import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

// โหลด .env จาก root โปรเจกต์ (ไฟล์เดียวทั้งระบบ)
loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
