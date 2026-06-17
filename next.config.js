const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.BUNDLE_ANALYZER === "true",
});

const withRoutes = require("nextjs-routes/config")({
  outDir: "nextjs",
});

const headers = require("./nextjs/headers");
const redirects = require("./nextjs/redirects");
const rewrites = require("./nextjs/rewrites");

/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: ["react-syntax-highlighter"],
  reactStrictMode: true,

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ==================== 内存优化重点 ====================
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    cpus: 1, // 关键：限制并行数，大幅降低内存峰值
    webpackBuildWorker: true, // 强制开启独立 Worker 构建（节省内存）
    webpackMemoryOptimizations: true, // Next.js 15+ 可用，进一步省内存
  },

  // Turbopack 配置
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveAlias: {
      fs: { browser: "./nextjs/empty-module.js" },
      net: { browser: "./nextjs/empty-module.js" },
      tls: { browser: "./nextjs/empty-module.js" },
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.output.environment = {
      ...config.output.environment,
      asyncFunction: true,
    };

    // 额外内存优化
    config.cache = false; // 构建时禁用缓存（可大幅降低内存）

    return config;
  },

  rewrites,
  redirects,
  headers,
  output: "standalone",
  productionBrowserSourceMaps: false,

  serverExternalPackages: [
    "@opentelemetry/sdk-node",
    "@opentelemetry/auto-instrumentations-node",
    "pino-pretty",
    "lokijs",
    "encoding",
  ],
};

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
