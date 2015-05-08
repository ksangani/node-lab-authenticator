let nodeifyit = require('nodeifyit')
let LocalStrategy = require('passport-local').Strategy
let User = require('./user')
let hash = require('./hash')

module.exports = (passport) => {
    passport.serializeUser(nodeifyit(async (user) => user.email))
    passport.deserializeUser(nodeifyit(async (email) => {
        return await User.findOne({email}).exec()
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, nodeifyit(async (email, password) => {
        email = (email || '').toLowerCase()
        let user = await User.promise.findOne({email})

        if (user === null) {
            return [false, {message: 'Invalid username'}]
        }

        let passwordHash = await hash.hash(password, user.salt)
        if (passwordHash.toString('base64') !== user.password) {
            return [false, {message: 'Invalid password'}]
        }
        return user
    }, {spread: true})))

    passport.use('signup', new LocalStrategy({
       usernameField: 'email'
    }, nodeifyit(async (email, password) => {
        email = (email || '').toLowerCase()
        if (await User.promise.findOne({email})) {
            return [false, {message: 'That email is already taken.'}]
        }

        let salt = hash.salt()
        let passwordHash = await hash.hash(password, salt)
        let user = new User()
        user.email = email
        user.salt = salt
        user.password = passwordHash.toString('base64')
        return await user.save()
    }, {spread: true})))
}
