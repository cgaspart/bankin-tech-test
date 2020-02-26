var express = require('express');
const fs = require('fs')
const jwt = require('jsonwebtoken')
const axios = require('axios').default
const opn = require('opn');

const app = express()
const qs = require('qs')
const privateKeyName = 'privatekey.pem' // Should be valid path to the private key
const issuer = '127.0.0.1' // Issuer for JWT, should be derived from your redirect URL
const client_id = 'rNVhGsBcR2CXciBacKxHvJu7CmRyj4WJl5fj6oG9QQw' // Your client ID
const aud = 'https://revolut.com' // Constant
const payload = {
  "iss": issuer,
  "sub": client_id,
  "aud": aud
}
const privateKey = fs.readFileSync(privateKeyName);
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60});

let code = null;
let access_token = null;
let refresh_token = null;

opn(`https://sandbox-business.revolut.com/app-confirm?client_id=${client_id}&redirect_uri=http://127.0.0.1/`);

function getToken(){
    axios({
        method: 'POST',
        url: 'https://sandbox-b2b.revolut.com/api/1.0/auth/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({
            "grant_type": "authorization_code",
            "code": code,
            "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            "client_id": client_id,
            "client_assertion": token,
        })
    }).then(res => {
        access_token = res.data.access_token;
        refresh_token = res.data.refresh_token;
        getAccount(access_token)
    })
    .catch(err => {console.log(err.message)})
}

function refreshToken(){
    
}

app.get('/', function(req, res, next) {
  
    code = req.query.code
    getToken();
  });

function getAccount(token){
    axios({
        method: "GET",
        url: "https://sandbox-b2b.revolut.com/api/1.0/accounts",
        headers: {Authorization: `Bearer ${token}`},
    }).then(res => {console.log(res.data)})
    .catch(err => {console.log(err.message)})
}

const listener = app.listen(80, function() {
    console.log('app is listening on port ' + listener.address().port);
  });