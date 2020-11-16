require('dotenv').config();
const { expect } = require('chai')
const supertest = require('supertest')
const knex = require('knex');
const app = require('../src/server.js');
global.expect = expect;
global.supertest = supertest;
process.env.NODE_ENV = 'test';
console.log("In the event of failing tests, please ensure the correct node verson\nand that the environment variables are properly configured.");
const db = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
})
app.set('db',db);