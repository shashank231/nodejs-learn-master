const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// for Handlebars template engine
// const expressHbs = require('express-handlebars')

const app = express();

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// for PUG template engine
// app.set('view engine', 'pug');

// for Handlebars template engine
// app.engine('hbs', expressHbs({layoutsDir: "views/layouts/", defaultLayout: "main-layout", extname: "hbs"}));
// app.set('view engine', 'hbs');

// for EJS template engine [IMP]
app.set('view engine', 'ejs');  // app.set allow us to set any value gloablly in our express application
                                // like a global configuration value
                                // we can set anytype of values in this app.se

app.set('views', 'views'); // [IMP] telling express where to find templates

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: ''});
});

app.listen(3000);
