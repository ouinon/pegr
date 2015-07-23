// http://stackoverflow.com/questions/28277094/req-session-passport-and-req-user-empty-serializeuser-and-deserializeuser-are-n
// http://stackoverflow.com/questions/24477035/express-4-0-express-session-with-odd-warning-message
// https://gist.github.com/stagas/754303
var express = require('express')
, passport = require('passport')
, sessions = require('express-session')
, util = require('util')
, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = "856529237741-fiupr834gedcuck1dgqlrftuadoltck5.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "jptHAFYnSL_YjR6wvsDEUARu";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8090/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

var app = express();

// configure Express

// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(sessions({
    genid: function(req) {
return 'ec666030-7f8f-11e3-ae96-0123456789ab'; // use UUIDs for session IDs
},
secret: 'keyboard cat', 
saveUninitialized: true,
resave: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    if (req.isAuthenticated()) {
        res.render('index', { user: req.user });
    }else{
        res.redirect('/auth/google');
    }
});

// app.get('/login',ensureAuthenticated, function(req, res){
// // consol
//     res.render('index', { user: req.user });
// });

// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', { user: req.user });
// });

// app.get('/login', function(req, res){
//   res.render('login', { user: req.user });
// });
app.get('/auth/google',
    passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
    }
);

app.get('/auth/google/callback', 
    passport.authenticate('google',
        { failureRedirect: '/' }
    ),
    function(req, res) {
        // console.log(req.user);
        req.login(req.user,function(){});
        res.redirect('/');
    }
);

app.listen(process.argv[2]);