const { compareSync } = require('bcryptjs');
const chai = require('chai')
const supertest = require('supertest')
const app = require('../src/server')
const vuid = require('../src/vuid');

describe('/api/login tests',async () => {
  const db = app.get('db')
  it('On successful login we should get a status of 200 and an object with a status message that equals "Approved"', async() => {
    
    const dummyAccount = {"email":`Cat@email.com`, "password":"password"};
    const testData = await supertest(app).post('/api/login').send(dummyAccount);
    
    return chai.expect(testData.status).to.equal(200) && chai.expect(testData.body.status).to.equal("Approved");

  })
  it('On unsuccessful login we should get a status of 400 and an object with an error message', async() => {
    const id = (new vuid()).v1();
    const dummyAccount = {"email":`Cat@email.com`, "password":"whatisthisnonsense"};
    const testData = await supertest(app).post('/api/login').send(dummyAccount);
    console.log(testData.body)
    
    return chai.expect(testData.status).to.equal(400) && chai.expect(Object.keys(testData.body)).to.contain("error");

  })
})