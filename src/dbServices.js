require('dotenv').config();
const knex = require('knex');
const {DATABASE_URL} = require('./config');
const {v4:uuid} = require('uuid');
const clientManager = require('./clientManager');
const db = knex({
    client:'pg',
    connection:DATABASE_URL
});


const dbServices = {
getUser:async function(response, user)
{
    let userdata = await db('users').select('*').where({auth_name:user}).catch(e =>{
        response.status(400).json({Auth:"Rejected",reason:"Could not obtain user info."});
    });
    console.log(user);
    
    if(userdata[0])
    {   
        //Will add auth here.
        if(1)
        {
            const channels = await dbServices.getUserChannels(userdata[0].auth_name);
            
            response.json({                
                user:userdata[0].auth_name,
                friends:userdata[0].friends,
                friendRequests:userdata[0].friend_requests,
                channels: channels,
                messages: await dbServices.getUserMessages(userdata[0].auth_name),
                sidebar_expanded:1
            });
        }        
    }
    else
    {
        response.send();
    }
     
          
},
getUserChannels:async(user)=>
{
    const channels = await db.raw(`select * from channels where '${user}' = ANY(participants)`);
    return channels.rows;
},
getUserMessages:async(user)=>
{
    const messages = await db.raw(`select * from messages JOIN channels on (channels.id = messages.channel) WHERE '${user}' = ANY(channels.participants);`);
    return messages.rows;
},
registerUser:(request,response,user)=>
{
    const {email,password,display_name, auth_name,id} = user

    //db('users').select('email').where({email:email});
},
registerMessage:async(msg)=>
{
    if(message)
    {
        const {id, message, date, channel, sender} = msg;
        return await db.raw(`INSERT INTO messages(id,message,date,channel,sender) VALUES (${id},${message},${date},${channel},${sender})`);
    }

},
login:async(request, response)=>
{
    const {email = '', password = ''} = request.body; 
    let userdata = await db('users').select('*').where({email:email}).catch(e =>{
        response.status(400).json({Auth:"Rejected",reason:"Possible connection problem."});
    });
    
    if(userdata[0])
    {
        if(userdata[0].password == password)
        {
            const token = uuid();
            const channels = await dbServices.getUserChannels(userdata[0].auth_name);
            userdata[0].token = token;
            userdata[0].channels = channels;
            userdata[0].connection = null;
            clientManager.initClient(userdata[0]);
            console.log(clientManager);
            response.json({
                Auth:"Approved",
                token:token,
                initState:{
                    user:userdata[0].auth_name,
                    friends:userdata[0].friends,
                    friendRequests:userdata[0].friend_requests,
                    channels: channels,
                    messages: await dbServices.getUserMessages(userdata[0].auth_name),
                    sidebar_expanded:1
                }
        });


        }
        else
        {
            response.json({Auth:"Rejected",reason:"Incorrect password."});
        }
    }
    else
    {
        response.json({Auth:"Rejected",reason:"Email doesn't exist."})
    }
    
    
}




};

  module.exports = dbServices;
  