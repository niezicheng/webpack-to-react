// 开发环境模式资源配置
// 使用webpack-merge合并common配置，使用webpack-dev-server开启开发服务器
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  // 设置为开发模式
  mode: 'development',
  // 设置source map, 方便打包源码时准确定位错误信息, inline-source-map不要用于生产环境
  devtool: 'inline-source-map',
  // 出口文件
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    port: 3000, // 服务启动端口号
    hot: true, // 开启热更新
    open: true, // 自动打开浏览器运行
    // 单页面应用前端路由使用history模式时，配置该选项当webpack-dev-server服务器接受请求路径不存在资源时，它将返回index.html而不是404页面
    historyApiFallback: true
  },
  // 加载loader配置资源
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 当打包时scss文件中碰到导入当scss文件，从前两个loader开始执行
              modules: true // 开启css模块化
            }
          },
          // 样式文件中样式添加不同浏览器兼容前缀
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: 'file-loader'
      }
    ]
  },
  // 添加插件plugins
  plugins: [
    // 将生成的js入口文件注入到模版文件中
    new HtmlWebpackPlugin({
      template: './src/template.html',
      favicon: './src/assets/favicon.jpg'
    })
  ]
})
