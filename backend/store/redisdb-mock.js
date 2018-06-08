const config = require('../config')
const Redis = require('ioredis-mock')
const jsf = require('json-schema-faker')
const userSchema = require('../resources/userSchema.js')
const _ = require('lodash')
const numUsers = 5
let redis
jsf.extend('faker', function() { return require('faker') })

let data = {
    'appnames': ['﻿slotsfreesocialcasino', 'source', 'soundbeta'],
    'users:_nextId': 806331,
    'users': {},
    'users:_emails':{},
    'users:_facebookId': {},
    'user:78105': { id: '1', username: 'superman', email: 'clark@daily.planet' },
}

function createUserData(){

    //TODO: this needs to be separated out
    const generateUserStore = () => {
        //TODO: https://app.quicktype.io/#l=schema
        return 'ok'
    }
    console.log('creating user data')
    const oneUser = jsf(userSchema)

    //TODO: stopped here.
    console.log(oneUser)
   generateUserStore()
    /*
    return _.map(_.range(numUsers), () => {
        return faker.internet.email();
    });*/
}
createUserData()

redis = new Redis({
    // `options.data` does not exist in `ioredis`, only `ioredis-mock`
    data,
}, function(){
    console.log('redis online')

})

module.exports = redis