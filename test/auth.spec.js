const { compareSync } = require('bcryptjs');
const chai = require('chai')
const supertest = require('supertest')
const app = require('../src/server')


let authToken = null;
describe('auth testing',async () => {
  const db = app.get('db')
  it('/api/login POST: On successful login we should get a status of 200 and an object with a status message that equals "Approved"', async() => {
    
    const dummyAccount = {"email":`Cat@email.com`, "password":"password"};
    const testData = await supertest(app).post('/api/login').send(dummyAccount);
    authToken = testData.body.auth_header;
    return chai.expect(testData.status).to.equal(200) && chai.expect(testData.body.status).to.equal("Approved");

  })
  it('/api/login POST: On unsuccessful login we should get a status of 400 and an object with an error message', async() => {
    
    const dummyAccount = {"email":`Cat@email.com`, "password":"whatisthisnonsense"};
    const testData = await supertest(app).post('/api/login').send(dummyAccount);
    //console.log(testData.body)
    
    return chai.expect(testData.status).to.equal(400) && chai.expect(Object.keys(testData.body)).to.contain("error");

  })
  it('/api/user Authorized GET : On valid authorization we should get a status of 200 and an object with our user data', async() => {
    
    
    const testData = await supertest(app).get('/api/user').set('authorization',authToken);
    //console.log(testData.body)
    
    return chai.expect(testData.status).to.equal(200) && chai.expect(Object.keys(testData.body)).to.contain('user');

  })
  it('/api/user Authorized GET : On invalid authorization we should get a status of 400 and an object with an error', async() => {
    
    
    const testData = await supertest(app).get('/api/user').set('authorization','NANA NANA NANA BATMAN');
    //console.log(testData.body)
    
    return chai.expect(testData.status).to.equal(400) && chai.expect(Object.keys(testData.body)).to.contain('error');

  })
  it('/api/channels Authorized PATCH : On valid authorization we should get a status of 200 and an object with our user data', async() => {
    
    
    const add = await supertest(app).patch('/api/channels').set('authorization',authToken).send({"action":"add","id":"sag45dg46ad5g"});
    const remove = await supertest(app).patch('/api/channels').set('authorization',authToken).send({"action":"remove","id":"sag45dg46ad5g"});
    testData = (add.status == 200)? add : remove;
    
    return chai.expect(testData.status).to.equal(200) && chai.expect(Object.keys(testData.body)).to.contain('success');

  })
  it('/api/channels Authorized PATCH : On invalid authorization we should get a status of 400 and an object with an error', async() => {
    
    
    const add = await supertest(app).patch('/api/channels').set('authorization','wut').send({"action":"add","id":"sag45dg46ad5g"});
    
    
    return chai.expect(add.status).to.equal(400) && chai.expect(Object.keys(add.body)).to.contain('error');

  })
 
})