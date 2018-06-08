const express = require('express')
const router = express.Router()

router.get('/echo', (req, res, next) => {
    res.json({
        pong: true,
        message: req.message || undefined,
        st: Date.now()
    })
})

//Displays information tailored according to the logged in user
router.get('/me/profile', (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message : 'You made it to the secure route',
        user : req.user
    })
})

module.exports = router