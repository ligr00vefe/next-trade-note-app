/** @type {import('next').NextConfig} */
const nextConfig = {
  // 필요한 다른 구성 옵션들
  webpack: (config) => {
    config.module.rules.forEach((rule) => {
      if (rule.test?.test?.('.scss')) {
        rule.use.forEach((loader) => {
          if (loader.loader?.includes('css-loader')) {
            loader.options.modules = {
              ...loader.options.modules,
              localsConvention: 'camelCaseOnly'
            };
          }
        });
      }
    });
    return config;
  }
}

module.exports = nextConfig;
