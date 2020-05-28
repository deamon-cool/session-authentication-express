const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({
    extended: true
}));


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};



app.get('/', (req, res) => {
    const { userId } = req.session;

    res.send(`
    <h1>Welcome!</h1>
    ${userId ? `
        <a href="/home">Home</a>
        <form method="POST" action="/logout">
            <button>Logout</button>
        </form>
        ` : `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    `}
    `);
});

app.get('/home', redirectLogin, (req, res) => {
    res.send(`
    <h1>Home</h1>
    <a href="/">Main</a>
    <ul>
        <li>Name: </li>
        <li>Email: </li>
    </ul>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="submit">
    </form>
    <a href="/register">Register</a>
    `);
});

app.post('/login', (req, res) => {

});

app.get('/register', (req, res) => {
    res.send(`
    <h1>Register</h1>
    <form method="POST" action="/register">
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="submit">
    </form>
    <a href="/login">Login</a>
    `);
});

app.post('/register', (req, res) => {

});

app.post('/logout', (req, res) => {

});



app.listen(PORT, () => console.log(`http://localhost:${PORT}`));