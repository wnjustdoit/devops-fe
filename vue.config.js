// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = {
    devServer: {
        port: 9999,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_DOMAIN_BASE_URL,
                pathRewrite: {
                    '^/api': ''
                },
                changeOrigin: true
            }
        }
    },
    // configureWebpack: {
    //     plugins: [
    //         new ParallelUglifyPlugin({
    //             cacheDir: '.cache/',
    //             uglifyJS: false
    //         })
    //     ]
    // },
    chainWebpack: config => { 
        config.optimization.minimize(false)
    }
}