const paths = require("react-scripts/config/paths"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ManifestPlugin = require("webpack-manifest-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  path = require("path");

module.exports = {
  webpack: override
};

function override(config, env) {
  let newConfig = {
    ...config,
    entry: {
      popup: paths.appSrc + "/views/popup",
      background: paths.appSrc + "/scripts/background",
      contentscript: paths.appSrc + "/scripts/contentscript",
      welcome: paths.appSrc + "/views/welcome",
      api: paths.appSrc + "/scripts/api",
      auth: paths.appSrc + "/views/auth"
    },
    output: {
      path: path.join(__dirname, "./build"),
      filename: "static/js/[name].js"
    },
    optimization: {
      splitChunks: {
        cacheGroups: { default: false }
      },
      runtimeChunk: false
    }
  };

  const minifyOpts = {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    },
    isEnvProduction = env === "production",
    popupHtmlPlugin = new HtmlWebpackPlugin({
      inject: true,
      chunks: ["popup"],
      template: paths.appHtml,
      filename: "popup.html",
      minify: isEnvProduction && minifyOpts
    });

  newConfig.plugins = replacePlugin(
    newConfig.plugins,
    (name) => /HtmlWebpackPlugin/i.test(name),
    popupHtmlPlugin
  );

  newConfig.plugins.push(
    generateHTMLEntry("welcome", isEnvProduction && minifyOpts),
    generateHTMLEntry("auth", isEnvProduction && minifyOpts)
  );

  const manifestPlugin = new ManifestPlugin({
      fileName: "asset-manifest.json"
    }),
    miniCssExtractPlugin = new MiniCssExtractPlugin({
      filename: "static/css/[name].css"
    });

  newConfig.plugins = replacePlugin(
    newConfig.plugins,
    (name) => /ManifestPlugin/i.test(name),
    manifestPlugin
  );
  newConfig.plugins = replacePlugin(
    newConfig.plugins,
    (name) => /MiniCssExtractPlugin/i.test(name),
    miniCssExtractPlugin
  );
  newConfig.plugins = replacePlugin(newConfig.plugins, (name) =>
    /GenerateSW/i.test(name)
  );

  return newConfig;
}

function replacePlugin(plugins, nameMatcher, newPlugin) {
  const i = plugins.findIndex((plugin) => {
    return (
      plugin.constructor &&
      plugin.constructor.name &&
      nameMatcher(plugin.constructor.name)
    );
  });
  return i > -1
    ? plugins
        .slice(0, i)
        .concat(newPlugin || [])
        .concat(plugins.slice(i + 1))
    : plugins;
}

function generateHTMLEntry(name, minify) {
  return new HtmlWebpackPlugin({
    inject: true,
    chunks: [name],
    template: paths.appPublic + `/${name}.html`,
    filename: `${name}.html`,
    minify
  });
}
