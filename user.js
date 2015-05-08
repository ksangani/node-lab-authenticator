let mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/authenticator', () => console.log('Connected to mongodb://127.0.0.1:27017'))

let userSchema = mongoose.Schema({
    email: String,
    password: String,
    salt: String
})

module.exports = mongoose.model('User', userSchema)