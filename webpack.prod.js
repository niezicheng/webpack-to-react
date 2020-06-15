/**
 * 将css样式从main.js内抽离到单独的.css文件   【使用mini-css-extract插件提供的loader替代style-loader】
 * 缓存处理  【output文件名添加contentHash根据打包文件内容产生并改变，浏览器缓存不同hash版本文件来调整访问资源】
 * 将第三方库和webpack的runtime从main.js内抽离出来（不希望每次业务的改动导致这些模块代码也重新加载）
 * 【
 *    1、optimization.runtimeChunk 选项设置为single，可以将webpack runtime抽离出来
 *    2、optimization.splitChunks 抽离出第三方库 【以前版本使用commons-chunk-plugin】
 *  】
 * js、css、html代码压缩 【使用optimization.minimizer进行配置】
 * 使用source-map替代inline-source-map
 * 【
 *    1、inline-source-map会将map内敛到代码内，用户会连同资源将map一起下载
 *    2、source-map会给打包后的每个js单独生成.map文件
 *  】
 * 懒加载（lazy loading）【webpack4默认支持，不需配置，开发时使用dynamic import按需引入模块，需要babel插件的支持】
 * 每次打包前先清空dist目录 【clean-webpack-plugin在打包前清空dist目录】
 */
// 生产模式环境资源配置
// 使用webpack-merge合并common配置，使用webpack-dev-server开启开发服务器
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  // 设置为生产（production）模式
  mode: "production",
  // 在生产环境中使用"source-map"而不是"inline-source-map"
  devtool: 'source-map', // source会给打包后的每个js单独生成.map文件
  // 出口文件
  output: {
    // 添加contentHash, 为配置entry入口名称, 默认取名为main则会生成main.xxx.js
    filename: '[name].[contentHash].js',
    // 通过splitChunk抽离出来【第三方库】的js文件名格式
    chunkFilename: '[name].[contentHash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  // 加载loader配置资源
  module: {
    rules: [
      {
        test: /\.scss$/,
        // 这里使用MiniCssExtractPlugin.loader替代style-loader
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: {
          // 这里使用url-loader替代file-loader
          loader: 'url-loader',
          options: {
            // 当图片小于8kb时，url-loader会将图片转为base64，这个可以减少http请求的数量
            // 当图片大于8kb时，url-loader会将图片交给file-loader处理
            limit: 1024 * 8,
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      }
    ]
  },

  // 优化
  optimization: {
    // 抽离webpack runtime到单文件
    runtimeChunk: 'single',

    // 抽离第三方库
    splitChunks: {
      chunks: 'all',
      // 最大初始请求数量
      maxInitialRequests: Infinity,
      // 抽离体积大于80kb的chunk，配合上面的 maxInitialRequests: Infinity
      // 小于80kb的所有chunk会被打包到一起，这样可以减少初始请求数
      minSize: 80 * 1024,
      // 抽离被多个入口引用次数大于等于1的chunk
      minChunks: 1,
      cacheGroups: {
        // 抽离node_module下面的第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // 根据路径获得第三方库的名称
          // 并将抽离的chunk以"vendor_thirdPartyLibrary"格式命名
          name: function(module, chunk, chacheGroupKey) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `vendor_${packageName.replace("@", "")}`;
          }
        }
      }
    },

    // 在mode设为"production"时，会默认使用terser-webpack-plugin插件对js进行压缩
    // 开启html和css的压缩
    minimizer: [
      // 压缩css
      new OptimizeCssAssetsWebpackPlugin(),
      // 压缩js，需将sourceMap设置为true, 否则无法生成source map
      new TerserWebpackPlugin({ sourceMap: true }),
      // 将入口文件导入模版，压缩html
      new HtmlWebpackPlugin({
        template: './src/template.html',
        favicon: './src/assets/favicon.jpg',
        minify: {
          // 去除换行符和空格
          collapseWhitespace: true,
          // 移除注释
          removeComments: true,
          // 移除属性上的引号
          removeAttributeQuotes: true,
        }
      }),
    ]
  },

  // 添加插件plugins
  plugins: [
    // 每次打包前，清除输出目录
    new CleanWebpackPlugin(),

    // 抽离样式为单独的.css文件
    new MiniCssExtractPlugin({
      // 设置抽离出来的文件名, contentHash会根据不同的文件内容产生不同的hash值，即产生新的资源文件【旧的资源文件也会在服务器上保存】
      filename: '[name].[contentHash].css',
      chunkFilename: '[id][contentHash].css'
    }),

    // 确保文件没发生变化时，contentHash也不会发生变化
    new webpack.HashedModuleIdsPlugin()
  ],

})
