const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys');


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to Mongo.. Yeah..')
});

mongoose.connection.on('error', () => {
    console.log('Something went wrong....!!')
});


require('./Models/users');
require('./Models/post');

app.use(express.json())
app.use(require('./Routes/auth'))
app.use(require('./Routes/post'))
app.use(require('./Routes/user'))


if(process.env.NODE_ENV === "production"){
    app.use(express.static('clickza/build'))

    const path = require('path')
    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'clickza', 'index.html'))
    })
}

app.listen(PORT, ()=> {
    console.log('Server is running on port number 5000');
});