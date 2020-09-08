require('dotenv').config();
const express = require('express');
const router = express.Router();
const {getUsers, login} = require('./dbServices');
const dbServices = require('./dbServices');
const clientManager = require('./clientManager');


router.route('/api/user/:token').get((request, response)=>{
    const token = request.params.token;
    const user = clientManager.findClientByToken(token);
    dbServices.getUser(response,user.auth_name);
    
})
router.route('/register').get((request, response)=>{
    response.send('Hello, here is some data.');
})

router.route('/login').post((request, response)=>{
    
    login(request, response);
})


module.exports = router;