const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');  // HERE the router is also a valid middleware function
                                                // that's why we can use app.use('/admin/', adminRoutes)

const shopRoutes = require('./routes/shop');

const app = express();

// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin/', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);