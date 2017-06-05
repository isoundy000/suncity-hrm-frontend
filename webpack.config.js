const fs = require('fs');
const path = require('path');
const process = require('process');
const cheerio = require('cheerio');

module.exports = function(webpackConfig, env) {
  webpackConfig.resolve.root = [path.resolve(__dirname, 'src')];

  webpackConfig.babel.plugins.push('transform-runtime');
  /* webpackConfig.babel.plugins.push(['antd', { style: "css" }]); */

  webpackConfig.babel.plugins.push(['import', {
    libraryName: 'antd',
    style: true,
  }]);

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = '#eval';
    webpackConfig.babel.plugins.push(['dva-hmr', {
      entries: [
        './src/index.js',
      ],
    }]);
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }

  if (process.env.NODE_ENV === 'production') {
    webpackConfig.plugins.push(function() {
      this.plugin("done", function(stats) {
        //insert hash to dist index.html
        var indexHtmlPath = path.resolve('.', 'dist', 'index.html')
        var hashMap = JSON.parse(fs.readFileSync(path.resolve('.', 'dist', 'map.json')));
        var indexHtml = fs.readFileSync(indexHtmlPath).toString();
        for(var key in hashMap) {
          indexHtml = indexHtml.replace(key, hashMap[key]);
        }
        fs.writeFileSync(indexHtmlPath, indexHtml);

        //insert loading pace to index.html
        var indexHtml = fs.readFileSync(indexHtmlPath).toString();
        var loadingPaceHtml = fs.readFileSync(path.resolve('.', 'loading-pace.html')).toString();
        let $ = cheerio.load(indexHtml);
        $('head').prepend(loadingPaceHtml);
        fs.writeFileSync(indexHtmlPath, $.html());
      });
    });
  }

  // Support CSS Modules
  // Parse all less files as css module.

  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.less$/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.less$/;
    }
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.css$/;
    }
    if (loader.test.toString() === '/\\.module\\.css$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.css$/;
    }
  });

  return webpackConfig;
};
