const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
 
mongoose.connect(config.database);

//connect to database
mongoose.connection.on('connected', ()=>{
    console.log('Connected to database '+config.database);
});

//error in database
mongoose.connection.on('error', (err)=>{
    console.log('Database error '+ err);
});

const app = express();

const users = require('./routes/users');

//Port Number
const port = 3000;

//CORS Middleware
app.use(cors());

//set static folder for angular material
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//anything that is /user/whatever will go to this file
app.use('/users',users);


//route to the home page, index route
app.get('/', (req,res)=>{
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.listen(port, ()=>{
    console.log('Server started on port '+port);
});