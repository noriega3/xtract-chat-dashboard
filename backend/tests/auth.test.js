/* global describe it */
const chai = require('chai')
chai.config.includeStack = true; // turn on stack trace
chai.config.showDiff = true; // turn off reporter diff display
let should = chai.should()
let expect = chai.expect

const request 		= require('request')

//simulated client (taken functions from dashboard)
process.env.NODE_PATH = '.'
process.env.DEBUG_COLORS = true
process.env.DEBUG_HIDE_DATE = true
process.env.NODE_ENV = "development"
process.env.DEBUG = "*,-not_this,-ioredis:*,-bull"


describe('REST Server',function(){
    this.timeout(10000)
    let args = {

    }

    //test against dummy data
    it('test login', function(done){

        new request({
            method: 'POST',
            url: ``,
            json:true,
            body: args,
        }, (err, response, resBody) => {
            
            done(err)
        })
    })

})
