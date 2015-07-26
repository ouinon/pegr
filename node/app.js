var express = require('express')
, env = require('node-env-file')
, passport = require('passport')
, sessions = require('express-session')
, cookieParser = require('cookie-parser')
, util = require('util')
, Cloudant = require('Cloudant')
, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

env(__dirname + '/../.env');

var cloudant = Cloudant({
    account: process.env.CLOUDANT_ACCOUNT,
    password: process.env.CLOUDANT_MASTER_PW,
    // requestDefaults: { "proxy": "http://localhost:8080/app" }
    },function(er,cloudant,reply){
        // if(err) throw err;
        // console.log(er,cloudant,reply,'first login');
    });

var cookies = {};

var username = 'example';

console.log(Cloudant);

// Cloudant({account:process.env.CLOUDANT_USERNAME,username:process.env.CLOUDANT_KEY, password:process.env.CLOUDANT_PASSWORD}, function(er, cloudant, reply) {
//   if (er)
//     throw er

//   console.log('Connected with username: %s', reply.userCtx.name)
// })

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
// console.log(process.env);
// process.exit();

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
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://local.pegs.website/node/auth/google/callback"
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

app.use(cookieParser());

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

// app.use(express.static(__dirname + '/public'));

app.get('/node', function(req, res){

    console.log('we got here');

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

        cloudant.auth(process.env.CLOUDANT_KEY, process.env.CLOUDANT_PW, function(err, body, headers) {
          if (err)
            return console.log('Error authenticating: ' + err.message);

            // console.log('Got cookie for %s: %s', username, headers['set-cookie']);

            // req.login(req.user,function(){});
            // Get the cookie that it's proposing to set and split it.
            var cookieA = headers['set-cookie'][0].replace(/[ \w-]+=/g,'').split(';');

            // res.cookie('AuthSession', headers['set-cookie'], { httpOnly: false });

            // You need to set the Authsession, nothing else. This appears to have worked, we'll see.
            res.cookie('AuthSession',cookieA[0],{httpOnly:false});
            // res.cookie('AuthSession', 'bWlsdXRoZXJlc3BlcmVkZXJlbGljaGF6OjU1QjREQ0U0OuFWO2QINdFcu2exFztLqRMCjy2G', { httpOnly: false });
            
            // res.cookie('AuthSession', headers['set-cookie'], { httpOnly: false });

            res.redirect('/');
            // res.cookie('sessionid', '1', { httpOnly: true });
            // console.log(headers['set-cookie']);
            // Store the authentication cookie for later.
            cookies[username] = headers['set-cookie'];
        });

    }
);

app.listen(process.argv[2]);