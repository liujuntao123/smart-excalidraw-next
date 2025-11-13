/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
//   流式传输配置
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ];
  },
};
export default nextConfig;
