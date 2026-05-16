const { defineConfig } = require('@vue/cli-service')
const isProd = process.env.NODE_ENV === 'production'
const isNetlify = process.env.NETLIFY === 'true'
module.exports = defineConfig({
  transpileDependencies: true,
  // if building on Netlify serve from root; otherwise use repo subpath in production
  publicPath: isNetlify ? '/' : (isProd ? '/salon-app/' : '/'),
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/images': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
