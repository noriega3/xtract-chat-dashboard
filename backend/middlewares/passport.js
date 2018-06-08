const config =  require('../config');
const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const UserModel = require('../models').UserModel;

const _isEmpty = require('lodash/isEmpty')
const _isEqual = require('lodash/isEqual')

//Create a passport middleware to handle user registration

/*
//no signups via web yet.
passport.use('signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    try {
        //Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password });
        //Send the user information to the next middleware
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));
*/

const JWTStrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTStrategy({
    //secret we used to sign our JWT
    secretOrKey : config.jwtSecret,
    //we expect the user to send the token as a bearer token
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    console.log('in jwt')

    try {
        await console.log('valid', token)

        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {

        console.log('err', error, token)
        return done(error);
    }
}));
//Create a passport middleware to handle User login
passport.use('login', new CustomStrategy(async (req, done) => {
    try {
        //Find the user associated with the email provided by the user
        const loginType = UserModel.getLoginType(req.body)
        console.log('here', loginType)

        const user = await UserModel.requestLogin(req.body)
        console.log('herre', user)

        if(_isEmpty(user)){
            //If the user isn't found in the database, return a message
            return done(null, false, { message : 'User not found'});
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
/*        if(_isEqual(loginType,'local')){
            const validate = await utils.isValidPassword(password)
            if(!validate){
                return done(null, false, { message : 'Wrong Password'});
            }
        }*/
        //Send the user information to the next middleware
        return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
        console.log('error', error)

        return done(error);
    }
}));

//Create a passport middleware to handle User token refresh
passport.use('refresh', new CustomStrategy(async (req, done) => {
    try {
        //Find the user associated with the email provided by the user
        const tokens = await UserModel.requestRefresh(req.body)

        if(_isEmpty(tokens)){
            //If the user isn't found in the database, return a message
            return done(null, false, { message : 'refresh not found'});
        }

        //Send the user information to the next middleware
        return done(null, tokens, { message : 'Refreshed Successfully'});
    } catch (error) {
        console.log('error', error)

        return done(error);
    }
}));

//Create a passport middleware to handle User logout
passport.use('logout', new JWTStrategy({
    //secret we used to sign our JWT
    secretOrKey : config.jwtSecret,
    //we expect the user to send the token as a bearer token
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    try {
        const result = await UserModel.requestLogout(token)
        console.log('logout request result', result, token)
        return done(null, result)
    } catch (error) {
        return done(error)
    }
}))