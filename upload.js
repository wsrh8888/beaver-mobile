
const manifest = require('./src/manifest.json')
if (process.argv[2] === 'dev') {
  manifest.appid = '1'
  const fs = require('fs')
  // 测试环境
  fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2))
  // 环境变量更新
  fs.writeFileSync('./src/env.json', JSON.stringify({
    "baseUrl": "http://127.0.0.1:20800",
    "ws": "http://127.0.0.1:20800/api/ws/ws",
    "updateId": "",
    "trackId": "",
    "loggerId": ""
  }, null, 2))
}
else if (process.argv[2] === 'test') {
  manifest.appid = '1'
  const fs = require('fs')
  // 测试环境
  fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2))
  // 环境变量更新
  fs.writeFileSync('./src/env.json', JSON.stringify({
    "baseUrl": "http://127.0.0.1:20800",
    "ws": "http://127.0.0.1:20800/api/ws/ws",
    "updateId": "",
    "trackId": "",
    "loggerId": ""
  }, null, 2))
} else {
  // 线上环境
  manifest.appid = '1'
  const fs = require('fs')
  fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2))
  // 环境变量更新
  fs.writeFileSync('./src/env.json', JSON.stringify({
    "baseUrl": "http://127.0.0.1:20800",
    "ws": "http://127.0.0.1:20800/api/ws/ws",
    "updateId": "",
    "trackId": "",
    "loggerId": ""
  }, null, 2))
}