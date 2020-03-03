var express = require('express');
const fs = require('fs')
const jwt = require('jsonwebtoken')
const axios = require('axios').default
const opn = require('opn');
var cors = require('cors');


let config = require('./config.json');

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

let access_token = config.access_token;
let refresh_token = config.refresh_token;

function updateConfig(){
    let newConfig = { 
        access_token: access_token,
        refresh_token: refresh_token
    }
    
    let data = JSON.stringify(newConfig, null, 2);
    fs.writeFileSync('config.json', data);
}

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
        updateConfig();
        getAccount();
    })
    .catch(err => {console.log(err.message)})
}

function refreshToken(){
    return axios({
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
        updateConfig();
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

function getTx(error, options){
    return axios({
        method: "GET",
        url: `https://sandbox-b2b.revolut.com/api/1.0/transactions${options}`,
        headers: {Authorization: `Bearer ${access_token}`},
    }).then(res => {return res.data})
    .catch(err => {
        if(err.response.status == 401){
            refreshToken();
        }
        return error ? err.message : getTx(1, options);
    })
}

app.use(cors())
app.get('/', function(req) {
    code = req.query.code
    getToken();
});

app.get('/getAccount', function (req, res){
    res.status = 200;
    getAccount()
    .then(result => {console.log(result); res.send(result)})
    .catch(err => {
        res.status = 400;
        res.send(err)
    })
})

app.get('/getTransactions', function (req, res){
    res.status = 200;
    let options = '';

    if (req.body && req.body.startDate && req.body.endDate){
        options = `?from=${req.body.startDate}&to=${req.body.endDate}`
    }
    getTx(0, options)
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