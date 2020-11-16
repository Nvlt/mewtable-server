const chai = require('chai')
const supertest = require('supertest')
const app = require('../src/server')

describe('App', () => {
  const db = app.get('db')
  it('GET / responds with 200 containing "Hello, world!"', async() => {
    
    return supertest(app).get('/').expect(200, 'Hello, world!');

  })
})