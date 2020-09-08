require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const Router = require('./Router');
const app = express();
const morganOption = (process.env.NODE_ENV === 'production') ? 'tiny' : 'common';


app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(Router);


module.exports = app