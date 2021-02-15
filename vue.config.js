module.exports = {
    publicPath: '/rule-front/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/':{
                target:'http://localhost:8080',
                changeOrigin:true,

            }
        }
    }
}