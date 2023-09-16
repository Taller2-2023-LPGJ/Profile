require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const profileRoute = require('./src/routes/profileRte');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/', profileRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
