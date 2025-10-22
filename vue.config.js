const { defineConfig } = require('@vue/cli-service')
const isProd = process.env.NODE_ENV === 'production'
const isNetlify = process.env.NETLIFY === 'true'
module.exports = defineConfig({
  transpileDependencies: true,
  // if building on Netlify serve from root; otherwise use repo subpath in production
  publicPath: isNetlify ? '/' : (isProd ? '/salon-app/' : '/')
})
