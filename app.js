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

const users = [
    { id: 1, name: 'dam', email: 'd@m.com', password: 'secret' },
    { id: 2, name: 'kkm', email: 'k@m.com', password: 'secret' },
    { id: 3, name: 'pim', email: 'p@m.com', password: 'secret' }
];

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
    const { userId } = req.session;

    res.send(`
    <h1>Welcome!</h1>
    <a href="/login">Login</a>
    <a href="/register">Register</a>

    <a href="/home">Home</a>
    <form method="POST" action="/logout">
        <button>Logout</button>
    </form>
    `);
});

app.get('/home', (req, res) => {

});

app.get('/login', (req, res) => {
    // req.session.userId =
});

app.post('/login', (req, res) => {

});

app.get('/register', (req, res) => {

});

app.post('/register', (req, res) => {

});



app.listen(PORT, () => console.log(`http://localhost:${PORT}`));