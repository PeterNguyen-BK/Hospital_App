const express = require('express');
const patientRoute = require('./routes/patient.route');
const doctorRoute = require('./routes/doctor.route');
const loginRoute = require('./routes/login.route');
const paymentRoute = require('./routes/payment.route');

const loginMiddleware = require('./middlewares/login.middleware');
const cookieParser = require('cookie-parser');

var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.use('/login', loginRoute)
app.use('/patients', loginMiddleware.requireLogin, patientRoute);
app.use('/doctors', loginMiddleware.requireLogin, doctorRoute);
app.use('/payment', loginMiddleware.requireLogin, paymentRoute);

app.listen(5000, function() {
    console.log('Server is running...');
});