const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const shouldAnalyze = process.env.ANALYZE === 'true'

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './public/index.html',
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'public',
        to: '',
        globOptions: { ignore: ['**/index.html'] },
      },
    ],
  }),
]

if (isProduction) {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/styles.[contenthash].css',
    })
  )
}

if (shouldAnalyze) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
      reportFilename: path.resolve(__dirname, 'dist/bundle-report.html'),
    })
  )
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@store': path.resolve(__dirname, 'src/store/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[name].[contenthash][ext]' },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name].[contenthash][ext]' },
      },
    ],
  },
  plugins,
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, 'public'),
    port: 3000,
    open: true,
    hot: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendors',
          chunks: 'all',
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10,
        },
      },
    },
    runtimeChunk: 'single',
  },
}
