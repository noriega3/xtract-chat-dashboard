const userService = require('../services/UserStore')

const _has = require('lodash/has')

//TODO: switch to mongo from for a better data structure (mongo/mongoose)
const UserModel = {
    userId: undefined,
    emailAddress: undefined,
    accountId: undefined,
    roles: undefined,
    auth: undefined,
    loginType: undefined,

    getLoginType(login){ //TODO: make a utils to get validators such as this
        if(_has(login, 'email')) {
            if(_has(login, 'facebookId'))
                this.loginType = 'facebook'
            if(_has(login, 'password'))
                this.loginType = 'email'
        } else if(_has(login, 'deviceId')) {
            this.loginType = 'deviceId'
        } else {
            this.loginType = false
        }
        return this.loginType
    },
    async requestLogin(login) {
        console.log('req login')
        const user = await userService.setUserLogin(login).catch((error)=>console.log(error))
        if(!user) throw new Error('INVALID USER DATA')

        this.userId = user._userId
        this.accountId = user._accountId
        this.roles = user._roles
        this.auth = user.auth

        return user
    },
    async requestRefresh(refreshToken) {
        const result = await userService.setUserRefreshTokens(refreshToken).catch((error)=>console.log(error))
        if(!result) throw new Error('INVALID TOKEN RECEIVED')
        this.auth = result
        return result
    },
    async requestLogout(token) {
        console.log('req login', token, this.accountId)
        const result = await userService.setUserLogout(this.accountId)
        if(!result) throw new Error('INVALID USER DATA')
        this.auth = undefined
        return result
    }
}

module.exports = UserModel