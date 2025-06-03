import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
})(nextConfig);
