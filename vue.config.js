// const path = require('path')
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // 目标 API 地址
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true, // 允许websockets跨域
            }
        },
        disableHostCheck: true,
    }
}