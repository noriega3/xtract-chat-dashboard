/*
Access token:
    It contains all the information the server needs to know if the user / device can access the resource you are requesting or not.
    They are usually expired tokens with a short validity period.

Refresh token:
https://security.stackexchange.com/questions/133388/does-expiring-the-oauth-refresh-token-at-the-same-time-as-the-access-token-have
    do not use refresh tokens to retrieve or set data, only to validate user and set a new refresh token.
    The refresh token is used to generate a new access token.
    Typically, if the access token has an expiration date, once it expires, the user would have to authenticate again to obtain an access token.
    With refresh token, this step can be skipped and with a request to the API get a new access token that allows the user to continue accessing the application resources.
 */
const database = require('../store').db
const _has = require('lodash/has')
const jwt = require('jsonwebtoken')
const config = require('../config')
const uuidv4 = require('uuid/v4')
const _isEqual = require('lodash/isEqual')
const _toInteger = require('lodash/toInteger')
const _size = require('lodash/size')
const _isEmpty = require('lodash/isEmpty')
const _reduce = require('lodash/reduce')
const _set = require('lodash/set')
const _get = require('lodash/get')
const _remove = require('lodash/remove')
let storedRefreshTokens = {}
const userId = {
    byEmail(){

    },
    byFacebookId(){

    },
    byDeviceId(){

    },
}

function getLoginType(loginData = {}){
    if(_has(loginData, 'loginType'))
        return _get(loginData, 'loginType')
    if(_has(loginData, 'email')) {
        if(_has(loginData, 'password'))
            return 'email'
        if(_has(loginData, 'facebookId'))
            return 'facebook'
    } else if(_has(loginData, 'deviceId')) {
        return 'deviceId'
    } else {
        throw new Error('INVALID LOGIN TYPE')
    }
}

async function setUserLogin(login = {}){
    console.log('get user by login')
    let loginType = _get(login, 'loginType', getLoginType(login))
    let userId

    switch(loginType){
        case 'email':
            userId = await getUserIdByEmail(login.email).catch((error)=>console.log(error));
            break;
        case 'facebook':
            userId = await getUserIdByFacebookId(login.facebookId).catch((error)=>console.log(error));
            break;
        case 'deviceId':
            userId = await getUserIdByDeviceId(login.deviceId).catch((error)=>console.log(error));
            break;
        default:
            throw new Error('INVALID PARAMS')
    }
    console.log('got user by login')
    if(!userId) throw new Error('NO USER ID FOUND')
    return await getUserLogin(userId).catch((error)=>console.log(error));
}

async function setTokens(userData){
    const accountId = _get(userData, '_accountId')
    const roles     = _get(userData, '_roles')
    const user  = { accountId, roles }
    const id = uuidv4()
    console.log(id)
    const refresh = await jwt.sign({id}, config.jwtSecret, {expiresIn: "10m"})  //we always refresh the token on the calling of this function
    const access = await jwt.sign({user}, config.jwtSecret, {expiresIn: "5m"})
    //(database) redis set/overwrite refresh tokens

    storedRefreshTokens[refresh] = {accountId}
    return { refresh, access }
}

async function setUserRefreshTokens(userData){
    const accountId = _get(userData, '_accountId')
    const roles     = _get(userData, '_roles')
    const user  = { accountId, roles }
    let token

    //TODO: detect if an expired refresh token is trying to be used (we then alert after x attempts)

    //redis call check if token exists

    //successful, generate new tokens
    return await setTokens(userData)
}
function setUserLogout(userData){
    invalidateTokens(userData)
    return 'OK'
}

function invalidateTokens(accountId = ''){
    _remove(storedRefreshTokens, currentObject => _isEqual(currentObject,accountId))
    console.log('after removal', storedRefreshTokens)

    //set redis something here. todo: set async/await
}

//TODO: separate redis calls to own file so can be easily switched out with another db
async function getUserIdByEmail(email){
    const userId = await database.hget('users:_emails', email).catch((error)=>console.log(error));
    if(_toInteger(userId))
        return userId
    else
        throw new Error('invalid data')
}

async function getUserIdByFacebookId(facebookId){
    const userId = await database.hget('users:_facebook', facebookId).catch((error)=>console.log(error));
    if(_toInteger(userId))
        return userId
    else
        throw new Error('invalid fb data')
}
async function getUserIdByDeviceId(deviceId){
    //TODO: not done yet need to convert on server
    const userId = await database.hget('users:_deviceIds', deviceId).catch((error)=>console.log(error));
    if(_toInteger(userId))
        return userId
    else
        throw new Error('invalid data')
}
async function getUserLogin(userId){
    if(_isEmpty(userId)) throw new Error('USER ID NOT FOUND')
    const fields = ['_accountId', '_emailAddress', '_password', '_type', '_facebookId', '_roles', '_refreshToken']
    const savedData = await database.hmget(`users:${userId}`, fields).catch((error)=>console.log(error));

    let data = _reduce(savedData, function(userData, value, i) {
        if(value) _set(userData, fields[i], value)
        return userData
    }, {'_userId': userId, '_roles': '[]'})

    data.auth = await setTokens(data)

    return data
}

module.exports = {
    setUserLogin,
    setUserLogout,
    setUserRefreshTokens,
}