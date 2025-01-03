
const manifest = require('./src/manifest.json')

if (process.argv[2] === 'test') {
  manifest.appid = ''
  const fs = require('fs')
  // 测试环境
  fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2))
  fs.writeFileSync('./src/env.json', JSON.stringify({
    "baseUrl": "http://127.0.0.1:8888",
    "ws": "http://127.0.0.1:8888/api/ws/ws"
  }, null, 2))
} else {
  // 线上环境
  manifest.appid = ''
  const fs = require('fs')
  fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2))
  // 环境变量更新
  fs.writeFileSync('./src/env.json', JSON.stringify({
    baseUrl:"http://127.0.0.1:9999",//线上
    "ws": "http://127.0.0.1:9999/api/ws/ws"
  }, null, 2))
}