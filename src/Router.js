require('dotenv').config();
const express = require('express');

const router = express.Router();
const {login} = require('./dbServices');
const dbServices = require('./dbServices');
const {v4:uuid} = require('uuid');
const atob = require('atob');
const app = require('./app');
const {formatArray} = require('./helpers.js');

function getAuthoriation(request,response)
{
    let clientManager = request.app.get('cm')
    let headers = request.headers || {};
    if(!headers.authorization)
    {
        response.status(400).json({error:'unauthorized'});
        return null;
    }
    const payload = headers.authorization.split('.')[1];
    if(!payload)
    {
        response.status(400).json({error:'unauthorized'});
        return null;
    }
    const token = JSON.parse(atob(payload)).token;
    if(!token)
    {
        response.status(400).json({error:'unauthorized'});
        return null;
    }
    const user = clientManager.findClientByToken(token)
    if(!user)
    {
        response.status(400).json({error:'unauthorized'});
        return null;
    }
    return user;
}

router.route('/api/user/').get(async(request, response)=>{
    const user = getAuthoriation(request,response);
    if(user)
    {
        response.status(200).json( await dbServices.getUser(user.auth_name) );
    }
});
router.route('/api/channels/').patch(async(request, response)=>{
    console.log(request.body);
    const clientManager = request.app.get('cm');
    let user = getAuthoriation(request,response);
    if(user)
    {
        let result;
        const {action,id} = request.body;
        if(action === 'add')
        {
            result = await dbServices.addUserToChannel(user.auth_name,id)
        }
        else
        {
            result = await dbServices.removeUserFromChannel(user.auth_name,id)
        }
        setTimeout(async() => {
            user.channels = await dbServices.getUserChannels(user.auth_name);
        }, 500);
        console.log(user.channels);
        if(Object.keys(result).includes('error'))
        {
            response.status(400).json(result);
        }
        else
        {
            console.log(user.auth_name)
            response.status(200).json({success:'updated successfully'});
            
            for(const user of result)
            {
                clientManager.sendTo(user,{type:"channel_update"});
            }
            
        }
        
    }
});
router.route('/api/channels/').post((request, response)=>{
    let user = getAuthoriation(request,response);
    if(user)
    {
        const {name,participants} = request.body;
        //participants.push(user.auth_name);
        const testChannel = {id:uuid(),name:name,participants:participants}
        response.send(dbServices.registerChannel(testChannel));
    }
    
    
});


router.route('/api/register').post(async (request, response)=>{
  
    await dbServices.registerUser(request, response);
});

router.route('/api/login').post((request, response)=>{
    
    login(request, response);

});
router.route('/').get((request, response)=>{
    
    response.status(200).send('Hello, world!');
});



module.exports = router;