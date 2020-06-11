const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 设置为生产（production）模式
  // 生产模式默认会将js代码压缩
  // mode用于设置模式 production | development
  mode: 'production',
  // 设置入口文件
  entry: './src/index.js',
  // 出口文件
  output: {
    // 设置出口文件名
    filename: 'main.js',
    // 设置出口文件目录
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    //  设置扩展，在导入文件是可以省略文件扩展名
    extensions: ['.js', '.json', '.jsx']
  },

  // 配置资源加载loader
  module: {
    rules: [
      {
        // 对'.js'或'.jsx'结尾的文件使用babel-loader进行转译
        // 需将babel-loader配置放到到'.babelrc'文件
        test: /\.jsx?$/,
        use: 'babel-loader'
      },
      {
        // 对css文件先后使用css-loader和style-loader，导入顺序从右向左
        // css-loader：将导入项目的css变为js模块
        // style-loader: 页面打开时，利用js将css模块内的样式注入到html头部的style标签内
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // 使用file-loader加载图片文件
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: 'file-loader'
      }
    ]
  },

  // 插件plugin的使用
  plugins: [
    // 将生成的入口js文件注入到模板html内
    new HtmlWebpackPlugin({
      // 设置模块的路径
      template: './src/template.html',
      // 设置favicon的路径
      favicon: './src/assets/favicon.jpg'
    })
  ]
};