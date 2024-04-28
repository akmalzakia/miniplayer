import express from 'express'
import dotenv from 'dotenv'
import request from 'request'

const port = 5000

global.access_token = ''

dotenv.config()

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express()

app.get('/auth/login', (req, res) => {
  var scope = "streaming user-read-email user-read-private"
  var state = generateRandomString(16)
  var auth_query_param = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_param.toString()}`)
})

app.get('/auth/callback', (req, res) => {
  const code = req.query.code
  console.log('callback')
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  }

  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/')
    } else {
      console.log(err);
      console.log(response)
      res.redirect('/')
    }
  })
})

app.get('/auth/token', (req, res) => {
  res.json({
    access_token: access_token
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

