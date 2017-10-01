const path = require('path');

module.exports = {
  components: 'src/index.js',
  webpackConfig: {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'examples'),
          ],
        },
      ],
    },
  },
}
