var express = require('express');
const fs = require('fs')
const jwt = require('jsonwebtoken')
const axios = require('axios').default
const opn = require('opn');
var cors = require('cors');

const app = express()
const qs = require('qs')
const privateKeyName = 'privatekey.pem'
const issuer = '127.0.0.1'
const client_id = 'rNVhGsBcR2CXciBacKxHvJu7CmRyj4WJl5fj6oG9QQw'
const aud = 'https://revolut.com'
const payload = {
  "iss": issuer,
  "sub": client_id,
  "aud": aud
}
const privateKey = fs.readFileSync(privateKeyName);
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60});

let code = null;
let access_token = 'oa_sand_ktSKWNXzt9sZcAlAlrRLY4aslQvvCs4ojeT8AfvSQ3c';
let refresh_token = 'oa_sand_lOuqhndUdrq6A2aeK3lDW7GTUr-2D0W0LjT90fHORSo';

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
        console.log('acces: ', access_token)
        refresh_token = res.data.refresh_token;
        console.log('refresh:', refresh_token)
        getAccount();
    })
    .catch(err => {console.log(err.message)})
}

function refreshToken(){
    axios({
        method: 'POST',
        url: 'https://sandbox-b2b.revolut.com/api/1.0/auth/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            "client_id": client_id,
            "client_assertion": token,
        })
    }).then(res => {
        access_token = res.data.access_token;
        refresh_token = res.data.refresh_token;
        getAccount();
    })
    .catch(err => {console.log(err.message)})
}

function getAccount(error){
    return axios({
        method: "GET",
        url: "https://sandbox-b2b.revolut.com/api/1.0/accounts",
        headers: {Authorization: `Bearer ${access_token}`},
    }).then(res => {return res.data})
    .catch(err => {
        if(err.response.status == 401){
            refreshToken();
        }
        return error ? err.message : getAccount(1);
    })
}
app.use(cors())
app.get('/', function(req) {
    code = req.query.code
    getToken();
});

app.get('/getAccount', function (req, res){
    console.log('hello')
    res.status = 200;
    getAccount()
    .then(result => {console.log(result); res.send(result)})
    .catch(err => {
        res.status = 400;
        res.send(err)
    })
})

function main(){
    if(!access_token){
        opn(`https://sandbox-business.revolut.com/app-confirm?client_id=${client_id}&redirect_uri=http://127.0.0.1/`);
    } else{getAccount()}
}

main();

const listener = app.listen(80, function() {
    console.log('app is listening on port ' + listener.address().port);
  });