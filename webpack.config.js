const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")


module.exports = {
    mode: "development",
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { url: false } }],
            },

        ],
    },
    devServer: {
        watchFiles: ["src/*.html", "src/static/css/*.css", "src/static/res/*.*"],
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "cfxs-pinout",
            filename: "index.html",
            template: "src/index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/static" },
            ],
        }),
        new MiniCssExtractPlugin,
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    entry: {
        main: path.resolve(__dirname, "src/main.ts")
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    // optimization: {
    //     mergeDuplicateChunks: true,
    //     mangleExports: true,
    //     minimize: true,
    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 compress: {
    //                     passes: 2,
    //                 },
    //                 keep_classnames: false,
    //                 keep_fnames: false,
    //                 toplevel: true,
    //                 mangle: {
    //                     properties: {
    //                         keep_quoted: true,
    //                         regex: /^([sm]?_|[A-Z])+/
    //                     }
    //                 }
    //             },
    //         }),
    //         new CssMinimizerPlugin(),
    //     ],
    // },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
