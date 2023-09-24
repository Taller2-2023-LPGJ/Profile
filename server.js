require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const profileRoute = require('./src/routes/profile');

const app = express();

app.use(bodyParser.json());

app.use('/', profileRoute);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});
