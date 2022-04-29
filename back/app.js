const express = require('express');
const helmet = require('helmet');
const app = express();
const path = require('path');
const PORT = 3333;

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

const userRoute = require('./routes/user.js');
const postRoute = require('./routes/post.js');

app.use('/user', userRoute);
app.use('/posts', postRoute);

app.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
})