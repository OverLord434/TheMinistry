import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack'
import 'webpack-dev-server'
import * as dotenv from "dotenv";


const config = (env: any): Configuration => {
    const isProduction = env.NODE_ENV === "production";
    const dotenvFilename = isProduction 
        ? path.resolve(__dirname, "../src/.env.production")
        : path.resolve(__dirname, "../src/.env.development")
        
    dotenv.config({ path: dotenvFilename });

    return {
        entry: path.resolve(__dirname, "../src/index.tsx"),
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "../dist"),
            clean: true,
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            modules: [path.resolve(__dirname, "src"), "node_modules"],
            alias: {
                app: path.resolve(__dirname, "../src/app/"),
                assets: path.resolve(__dirname, "../src/assets/"),
                entities: path.resolve(__dirname, "../src/entities/"),
                features: path.resolve(__dirname, "../src/features/"),
                pages: path.resolve(__dirname, "../src/pages/"),
                shared: path.resolve(__dirname, "../src/shared/"),
                widgets: path.resolve(__dirname, "../src/widgets/"),
            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                }, 
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name][ext]',
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name][hash][ext]',
                    }
                }
                
            ],
        },
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "source-map" : "cheap-module-source-map",
        devServer: {
            open: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "public/index.html",
            }),
            new Dotenv({
                path: dotenvFilename,
                systemvars: true,
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV':  JSON.stringify(process.env.NODE_ENV || 'development')
            })
        ],
        }
        
    
}

export default config;