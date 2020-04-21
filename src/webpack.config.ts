/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import webpack, { Configuration } from 'webpack'
import { resolve as resolvePath, join } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import PurgecssPlugin from 'purgecss-webpack-plugin'
import TerserJSPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import glob from 'glob'

const PATHS = {
  src: join(__dirname, 'src')
}
const path = resolvePath(process.cwd(), 'public')
const output = {
  filename: '[name].bundle.js',
  path,
  publicPath: '/'
}
const resolve = {
  modules: ['node_modules'],
  extensions: ['.ts', '.tsx', '.js', '.jsx']
}
const webpackModule = {
  rules: [
    {
      test: /\.(j|t)s(x)?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            [
              '@babel/preset-env',
              { targets: { browsers: 'last 2 versions' } } // or whatever your project requires
            ],
            '@babel/preset-typescript',
            '@babel/preset-react'
          ],
          plugins: [
            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            'react-hot-loader/babel',
            '@babel/transform-runtime'
          ]
        }
      }
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // only enable hot in development
            hmr: process.env.NODE_ENV === 'development',
            // if hmr does not work, this is a forceful method.
            reloadAll: true
          }
        },
        { loader: 'css-loader' },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('tailwindcss'),
              require('autoprefixer')
            ]
          }
        }
      ]
    }
  ]
}
const optimization: any = {
  minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  splitChunks: {
    cacheGroups: {
      styles: {
        name: 'main',
        test: /\.css$/,
        chunks: 'all',
        enforce: true
      }
    }
  }
}
const plugins: any = [
  new PurgecssPlugin({
    paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
  }),
  new MiniCssExtractPlugin({
    filename: '[name].bundle.css'
  })]

const configDev = (): Configuration => {
  const devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [`${path}/*.hot-update.*`]
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/development.html'
    })
  ]

  return {
    mode: 'development',
    entry: [
      './src/web/index.tsx',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    ],
    optimization,
    devtool: 'inline-source-map',
    output,
    resolve,
    module: webpackModule,
    plugins: [...plugins, ...devPlugins]
  }
}
const configProd = (): Configuration => {
  return {
    mode: 'production',
    entry: ['./src/web/index.tsx'],
    optimization,
    output,
    resolve,
    module: webpackModule,
    plugins,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }
}

const config = process.env.NODE_ENV === 'development' ? configDev() : configProd()
export default config
