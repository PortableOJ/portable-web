// const path = require('path')
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // 目标 API 地址
                target: 'http://10.21.11.56:10086',
                ws: true,
                changeOrigin: true,
            }
        },
        disableHostCheck: true,
    }
}