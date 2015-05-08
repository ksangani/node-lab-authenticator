let express = require('express')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let passport = require('passport')
let flash = require('connect-flash')
let app = express()
require('songbird')
require('./auth')(passport)

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 8000
const SUCCESS = {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}

app.set('view engine', 'ejs')

// Middleware
if (NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}
app.use(cookieParser('ilovethenodejs'))            
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// In-memory session support, required by passport.session()
app.use(session({
  secret: 'ilovethenodejs',
  resave: true,
  saveUninitialized: true
}))

// initialize passport after session
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// API
app.get('/', (req, res) => res.render('index.ejs', {message: req.flash('error')}))

app.post('/login', passport.authenticate('login', SUCCESS))
app.get('/login', isLoggedIn, (req, res) =>  {
    res.render('profile.ejs', {user: req.user})
})

app.post('/signup', passport.authenticate('signup', SUCCESS))
app.get('/signup', isLoggedIn, (req, res) =>  {
    res.render('profile.ejs', {user: req.user})
})

app.get('/profile', isLoggedIn, (req, res) =>  {
    res.render('profile.ejs', {user: req.user})
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}

app.listen(PORT, () => console.log(`HTTP server listening @http://127.0.0.1:${PORT}`))
