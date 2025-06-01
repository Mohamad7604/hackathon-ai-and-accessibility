const path = require('path');

module.exports = {
  mode: 'production',  // Change to 'development' if you want source maps

  // ─────── ENTRY POINTS ───────────────────────────────────────────────────
  entry: {
    background:        './background.js',
    content:           './textCustomization.js',
    aiSimplification:  './aiSimplification.js',
    textToSpeech:      './textToSpeech.js',
    vocabularyHelper:  './vocabularyHelper.js',
    popup:             './popup.js',
    options:           './options.js'
  },

  // ─────── OUTPUT ─────────────────────────────────────────────────────────
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // ─────── MODULE RULES ────────────────────────────────────────────────────
  module: {
    rules: [
      {
        test: /\.(woff2?|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
      // You can add more loaders here if needed
    ]
  },

  // ─────── RESOLVE & SOURCE MAP ─────────────────────────────────────────────
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map'
};
