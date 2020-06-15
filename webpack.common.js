// 公共配置文件
const path = require('path');

module.exports = {
  // 入口文件
  entry: './src/index.jsx',
  resolve: {
    // 引入文件时省略扩展名
    extensions: ['.js', '.json', '.jsx']
  },
  // 资源加载loader
  module: {
    rules: [
      {
        test: /.\jsx?$/,
        // 使用include使webpack只对src下面的js、jsx文件进行babel转译， 加快webpack打包的速度
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader'
      }
    ]
  }
}