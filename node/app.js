var 
express = require('express'),
env = require('node-env-file'),
passport = require('passport'),
sessions = require('express-session'),
cookieParser = require('cookie-parser'),
util = require('util'),
Cloudant = require('cloudant'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load Environment Variables
env(__dirname + '/.env');

var cloudant = Cloudant({
    account: process.env.CLOUDANT_ACCOUNT,
    password: process.env.CLOUDANT_MASTER_PW,
    },function(err,cloudant,reply){
        if(err){throw err;}
    });

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

app.use(cookieParser());

app.use(sessions({
    secret: process.env.SESSION_SECRET, 
    saveUninitialized: true,
    resave: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).

app.use(passport.initialize());
app.use(passport.session());

// #RES I'm not sure why it won't let me use app.get('/index.html'
// app.get('/index.html', function(req, res){

//     res.setHeader('Content-Type', 'application/json');

//     if (req.isAuthenticated()) {

//         cloudant.auth({account:process.env.CLOUDANT_ACCOUNT, cookie:res.cookie('AuthSession')},function(err, body, headers){

//             console.log(err, body, headers);

//         });

//         res.send(JSON.stringify({loggedIn: true }));

//     }else{
//         // If the user is not logged in remove their cookies
//         res.clearCookie('UserId');
//         res.clearCookie('Name');
//         res.clearCookie('AuthSession');

//         // #FAIRE logout of Cloudant as well.
//         res.send(JSON.stringify({loggedIn: false }));
//     }
// });

app.get('/auth/google',
    passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/userinfo.email'] })
);

// #RES We do this to acquire a new cookie should our other expire
// The '/google/callback/' is a requirement in the URL to ensure that we avoid:
// "The proxy server received an invalid response from an upstream server"
app.get('/auth/google/callback/verify',
    function(req, res) {
        
        res.setHeader('Content-Type', 'application/json');

        if (req.isAuthenticated()) {

            cloudant.auth(process.env.CLOUDANT_KEY, process.env.CLOUDANT_PW, function(err, body, headers) {
                
                if(err){
                    throw err;
                } 

                var cookieAr = headers['set-cookie'][0].replace(/[ \w-]+=/g,'').split(';');
                res.cookie('UserId',req.user.id,{httpOnly:false});
                res.cookie('Name',req.user.displayName,{httpOnly:false});
                res.cookie('AuthSession',cookieAr[0],{httpOnly:true});
                res.send(JSON.stringify({LoggedIn:true, UserId: req.user.id,Name: req.user.displayName}));

            });

        }else{

            res.clearCookie('UserId');
            res.clearCookie('Name');
            res.clearCookie('AuthSession');
            res.send(JSON.stringify({LoggedIn:false}));

        }

    }
);

app.get('/auth/google/logout',
    function(req, res) {

        res.clearCookie('UserId');
        res.clearCookie('Name');
        res.clearCookie('AuthSession'); 
        req.logout();
        res.send(JSON.stringify({LoggedIn:false}));

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
            var cookieAr = headers['set-cookie'][0].replace(/[ \w-]+=/g,'').split(';');

            res.cookie('UserId',req.user.id,{httpOnly:false});
            res.cookie('Name',req.user.displayName,{httpOnly:false});
            res.cookie('AuthSession',cookieAr[0],{httpOnly:true});

            res.redirect('/');

        });

    }
);
// Incase '/' is registered instead of '/index.html'
app.get('/',function(){
    res.redirect('/index.html');
});
// Handle everything else, 404s etc.
app.use(function(req, res){
   res.sendStatus(404);
});

app.listen(process.argv[2]);