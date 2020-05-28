const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');


// constants

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


// express settings

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


// middlewares

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/home');
    } else {
        next();
    }
};



// endpoints

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

app.get('/login', redirectHome, (req, res) => {
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

app.post('/login', redirectHome, (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        const user = users.find(
            user => user.email === email && user.password === password
        );

        if (user) {
            req.session.userId = user.id;
        }

    }
});

app.get('/register', redirectHome, (req, res) => {
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

app.post('/register', redirectHome, (req, res) => {

});

app.post('/logout', redirectLogin, (req, res) => {

});



// server listener

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));