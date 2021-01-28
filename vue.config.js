module.exports = {
    devServer: {
      host: 'localhost',
      disableHostCheck: true,
      port: 8080,
      proxy: {
        '/': {
          target: 'http://dpgl.aihxkj.com',// 要跨域的域名
        }
        
      }
    }
  }