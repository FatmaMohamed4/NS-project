// const express = require('express');
// const session = require('express-session');
// const taskRoute = require('./route/taskRoute.js');
// const userRoute = require('./route/userRoute');
// const authController = require('./controller/authController'); // Import authController
// const app = express();

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // Set view engine after initializing the app object
// app.set('view engine', 'ejs');

// app.use(session({
//     secret: 'yOur to-do-app sessions', 
//     cookie: {maxAge: 24 * 60 * 60 * 1000},
//     resave: true,
//     saveUninitialized: true
// }));

// // Middleware to set user information from session
// app.use((req, res, next) => {
//     res.locals.currentUser = req.session.user;
//     res.locals.isAuthenticated = req.session.authenticated || false;
//     next();
// });

// // Middleware to handle authentication errors
// app.use((err, req, res, next) => {
//     if (err.name === 'UnauthorizedError') {
//         // Redirect to login page or send error response
//         res.status(401).json({ status: false, message: "Unauthorized: Please log in" });
//     } else {
//         next(err);
//     }
// });

// app.get("/", (req, res) => {
//     res.render("index");
// });

// app.get("/login", (req, res) => {
//     res.render("Login");
// });

// app.get("/signup", (req, res) => {
//     res.render("SignUp");
// });

// app.get("/forgetpassword", (req, res) => {
//     res.render("forgetpassword");
// });

// app.get("/tasks", (req, res) => {
//     res.render("tasks");
// });

// app.get("/resetpassword", (req, res) => {
//     res.render("resetpassword");
// });

// app.use(express.json()); 

// app.use('/users', userRoute);
// app.use('/tasks', taskRoute);

// app.use('*', (req, res) => {
//     res.status(404).json({
//         message: "Page not found"
//     });
// });

// module.exports = app;
const express = require('express');
const session = require('express-session');
const taskRoute = require('./route/taskRoute.js');
const userRoute = require('./route/userRoute');
const authController = require('./controller/authController'); // Import authController
const app = express();
const axios = require('axios'); // Import Axios


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set view engine after initializing the app object
app.set('view engine', 'ejs');

app.use(session({
    secret: 'yOur to-do-app sessions', 
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    resave: true,
    saveUninitialized: true
}));

// Middleware to set user information from session
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    res.locals.isAuthenticated = req.session.authenticated || false;
    next();
});

// Middleware to handle authentication errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // Redirect to login page or send error response
        res.status(401).json({ status: false, message: "Unauthorized: Please log in" });
    } else {
        next(err);
    }
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("Login");
});

app.get("/signup", (req, res) => {
    res.render("SignUp");
});

app.get("/forgetpassword", (req, res) => {
    res.render("forgetpassword");
});

app.get("/tasks", (req, res, next) => {
    // Check if user is authenticated
    if (req.session.authenticated) {
        res.render("tasks");
    } else {
        // User is not authenticated, redirect to login page
        res.redirect("/login");
    }
});

app.get("/resetpassword", (req, res) => {
    res.render("resetpassword");
});

app.use(express.json()); 

app.use('/users', userRoute);
app.use('/tasks', taskRoute);

app.use('*', (req, res) => {
    res.status(404).json({
        message: "Page not found"
    });
});

module.exports = app;
