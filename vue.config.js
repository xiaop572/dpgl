module.exports = {
  devServer: {
    host: 'localhost',
    disableHostCheck: true,
    port: 8080,
    proxy: {
      '/control': {
        target: 'http://zhcn.aihxkj.com',
      },
      '/': {
        target: 'http://dpgl.aihxkj.com', // 要跨域的域名
      }

    }
  }
}