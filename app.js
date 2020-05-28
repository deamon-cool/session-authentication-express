const express = require('express');
const session = require('express-session');

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    PORT = 3000,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet,it\'asecret',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

const app = express();

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
    }
}));

app.get('/', (req, res) => {

});

app.get('/home', (req, res) => {

});

app.get('/login', (req, res) => {

});

app.post('/login', (req, res) => {

});

app.get('/register', (req, res) => {

});

app.post('/register', (req, res) => {

});



app.listen(PORT, () => console.log(`http://localhost:${PORT}`));