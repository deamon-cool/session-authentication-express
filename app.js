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

// TODO: DB
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

app.use((req, res, next) => {
    const { userId } = req.session;

    if (userId) {
        res.locals.user = users.find(user => user.id === userId);
    }

    next();
});


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
    const user = users.find(user => user.id === req.session.userId);

    res.send(`
    <h1>Home</h1>
    <a href="/">Main</a>
    <ul>
        <li>Name: ${user.name}</li>
        <li>Email: ${user.email}</li>
    </ul>
    `);
});

app.get('/profile', (req, res) => {
    const user = users.find(user => user.id === req.session.userId);
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

    if (email && password) {    // TODO: need to be validated first
        const user = users.find(
            user => user.email === email && user.password === password  // TODO: need to be hashed first
        );

        if (user) {
            req.session.userId = user.id;

            return res.redirect('/home');
        }

    }

    res.redirect('/login');
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
    const { name, email, password } = req.body;

    if (name && email && password) {    // TODO: need to be validated first
        const exists = users.some(
            user => user.email === email
        );

        if (!exists) {
            const user = {
                id: users.length + 1,
                email,
                password    // TODO: need to be hashed first
            }

            users.push(user);

            req.session.userId = user.id;

            return res.redirect('/home');
        }
    }

    res.redirect('/register');      // TODO: Error: user exist now, email too short, wrong password
});

app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }

        res.clearCookie(SESS_NAME);
        res.redirect('/login');
    });
});



// server listener

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));