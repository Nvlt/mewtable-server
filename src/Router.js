require('dotenv').config();
const express = require('express');
const router = express.Router();
const {login} = require('./dbServices');
const dbServices = require('./dbServices');
const clientManager = require('./clientManager');
const {v4:uuid} = require('uuid');




router.route('/api/user/:token').get((request, response)=>{
    const token = request.params.token;
    const user = clientManager.findClientByToken(token);
    dbServices.getUser(response,user.auth_name);
    
});
router.route('/api/channels/').get((request, response)=>{
    const testChannel = {id:uuid(),name:'Test Channel',participants:`'Violet#15638','HAXOR#98775'`}
    response.send(dbServices.registerChannel(testChannel));
    
});
router.route('/api/channels/').get((request, response)=>{
    const testChannel = {id:uuid(),name:'Test Channel',participants:`'Violet#15638','HAXOR#98775'`}
    response.send(dbServices.registerChannel(testChannel));
    
});
router.route('/api/register').post(async (request, response)=>{
  
    await dbServices.registerUser(request, response)
});

router.route('/api/login').post((request, response)=>{
    
    login(request, response);

});
router.route('/').get((request, response)=>{
    
    response.status(200).send('Hello, world!');
});



module.exports = router;