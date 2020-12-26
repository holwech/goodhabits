module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m4a$/,
          loader: 'url-loader',
        },
        {
          test: /\.png$/,
          loader: 'url-loader',
        }
      ]
    }
  }
};
