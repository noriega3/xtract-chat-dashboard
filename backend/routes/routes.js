const express = require('express')
const passport = require('passport')
const router = express.Router()

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', passport.authenticate('signup', { session : false }) , (req, res) => {
    res.json({
        message : 'Signup successful',
        user : req.user
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        console.log('auth ')
        try {
            if(err || !user){
                const error = new Error('An Error occured')
                return next(error)
            }
            req.login(user, { session : false }, (error, auth) => {
                if( error ) return next(error)
                return res.json(user.auth)
            })
        } catch (error) {
            console.log('router post after error', error)
            return next(error)
        }
    })(req, res, next)
})

router.post('/refresh', async (req, res, next) => {
    passport.authenticate('refresh', (err, user, info) => {
        try {
            if(err || !user){
                const error = new Error('An Error occured')
                return next(error)
            }
            req.login(user, { session : false }, (error, auth) => {
                if( error ) return next(error)
                return res.json(user.auth)
            })
        } catch (error) {
            return next(error)
        }
    })(req, res, next)
})

router.post('/logout', passport.authenticate('logout', { session : false }) , (req, res) => {
    res.json({
        message : 'Logout successful',
        user: req.user
    })
})
module.exports = router