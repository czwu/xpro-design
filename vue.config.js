const path = require('path')
var webpack = require('webpack')

const minify = process.env.NODE_ENV === 'development' ? false : {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '../low_code_design/'
    : '/',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      minify
    }
  },
  devServer: {
    disableHostCheck: true,
    overlay: false,
    port: 8083,
    proxy: {
      '/api': {
        //  target: 'http://devops-test.winnermedical.com', // 测试环境
        // target: 'http://devops.winnermedical.com', // 正式环境
        target: 'http://luoma.winnermedical.com/',
        changeOrigin: true
      },
      '/low_code_design': {
        target: 'http://localhost:8083',
        pathRewrite: { '^/low_code_design': '' }
      }

    }
  },
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'source-map',
    externals: {
      vue: 'Vue'
      // 'vue-router': 'VueRouter'
      // 'element-ui': 'ELEMENT'
    }
  },
  chainWebpack(config) {
    //解决控制态报错 
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
  // pluginOptions: {
  //   dll: {
  //     entry: ['vue'],
  //     cacheFilePath: path.resolve(__dirname, './public')
  //   }
  // }
}
