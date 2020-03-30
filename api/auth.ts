import {NowRequest, NowResponse} from '@now/node'
import * as qs from 'querystring'
import  * as https from 'https'


const config = {
  oauth_client_id: process.env.OAUTH_CLIENT_ID,
  oauth_host: 'github.com',
  oauth_port: 443,
  oauth_path: '/login/oauth/access_token',
  oauth_method: 'POST',
}

function authenticate(code, cb) {
  var data = qs.stringify({
    client_id: config.oauth_client_id,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    code
  })

  var reqOptions = {
    host: config.oauth_host,
    port: config.oauth_port,
    path: config.oauth_path,
    method: config.oauth_method,
    headers: {'content-length': data.length}
  }

  var body = ''
  var req = https.request(reqOptions, function (res) {
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      body += chunk
    })
    res.on('end', function () {
      cb(null, qs.parse(body).access_token)
    })
  })

  req.write(data)
  req.end()
  req.on('error', function (e) {
    cb(e.message)
  })
}

export default (req: NowRequest, res: NowResponse) => {
  console.log('code', req.query.code)
  if (!req.query.code) {
    res.status(400).json({
      status: 400,
      error: `Missing required parameter 'code'`,
      meta: {
        code: 'Required parameter'
      }
    })
    return
  }

  authenticate(req.query.code, function (err, token) {
    let result
    if (err || !token) {
      console.error('error', err)
      return res.status(400).json({
        status: 400,
        error: err || 'Bad code',
      })
    } else {
      result = {
        status: 200,
        token
      }
    }
    console.log('send token')
    res.status(200).json(result)
  })
}
