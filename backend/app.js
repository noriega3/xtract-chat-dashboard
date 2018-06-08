const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('./config')
const logger = require('morgan')
const passport = require('passport')
const jwt = require('jsonwebtoken')

require('./middlewares/passport')

// Setting up basic middleware for all Express requests
app.use(logger('dev')) // Log requests to API using morgan

// Enable CORS from client-side
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})*/

app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize())

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-route');

app.use('/api/v2/auth', routes)
app.use('/api/v2/', passport.authenticate('jwt', { session : false }), secureRoute)

//Handle errors
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({ error : err.toString() });
})

/***
 * Handle a SIGINT or otherwise tasks that will wait before the shutdown of the server
 * @returns {Promise<string>}
 */
async function gracefulShutdown(){
    console.log('shutting servers down')
    await require('./store').db.quit()
    return 'OK'
}

//Nodemon
process.once('SIGUSR2', async function () {
    await gracefulShutdown()
    console.log('servers closed')
    process.kill(process.pid, 'SIGUSR2')
})

//start server
app.listen(config.port, () => {
    console.log('App listening on port '+ config.port)
})