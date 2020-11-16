const { compareSync } = require('bcryptjs');
const chai = require('chai')
const supertest = require('supertest')
const app = require('../src/server')
const vuid = require('../src/vuid');

describe('/api/register tests',async () => {
  const db = app.get('db')
  it('On successful registration we should get a status of 200 and an object with a status message that equals "Approved"', async() => {
    const id = (new vuid()).v1();
    const dummyAccount = {"email":`${id}@${id}.com`, "password":"password","display_name":"Mewtwo"};
    const testData = await supertest(app).post('/api/register').send(dummyAccount);
    
    return chai.expect(testData.status).to.equal(200) && chai.expect(testData.body.status).to.equal("Approved");

  })
  it('On unsuccessful registration we should get a status of 400 and an object with an error message', async() => {
    const id = (new vuid()).v1();
    const dummyAccount = {"email":`${id}@${id}.com`, "password":"password","display_name":""};
    const testData = await supertest(app).post('/api/register').send(dummyAccount);
    console.log(testData.body)
    
    return chai.expect(testData.status).to.equal(400) && chai.expect(Object.keys(testData.body)).to.contain("error");

  })
})