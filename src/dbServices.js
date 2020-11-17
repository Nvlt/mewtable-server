require('dotenv').config();
const knex = require('knex');
const {DATABASE_URL} = require('./config');
const {v4:uuid} = require('uuid');
const bcrypt = require('bcryptjs');
const vuid = require('./vuid');
const {formatArray} = require('./helpers.js');
const authService = require('./authService');
const db = knex({
    client:'pg',
    connection:DATABASE_URL
});


const dbServices = {
getUser:async function(user)
{
    let userdata = await db('users').select('*').where({auth_name:user}).catch(e =>{
        return null;
    });
    if(!userdata)
    {
        return null;
    }
    if(userdata[0])
    {   
        const channels = await dbServices.getUserChannels(userdata[0].auth_name);
        let public_channels = await db.raw(`SELECT * FROM channels WHERE NOT '${user}' = ANY(participants);`);
        public_channels = public_channels.rows;
        
        return {                
            user:userdata[0].auth_name,
            friends:userdata[0].friends,
            friendRequests:userdata[0].friend_requests,
            public_channels,
            channels: channels,
            messages: await dbServices.getUserMessages(userdata[0].auth_name)
        };        
    }
    return null;
          
},
validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    return null;
  },
hashPassword(password) {
    return bcrypt.hash(password, 12);
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
validateUser(user = {})
{
    if(!user)
    {
        user = {};
    }
    const {email,password,display_name} = user;
    if(!email || !password || !display_name)
    {
        return "please choose an email, display name, and password.";
    }
    return null;
},
registerUser:async(request, response)=>
{
    let user = request.body;
    const userError = dbServices.validateUser(user);
    if(userError)
    {
        return response.status(400).json({error:userError});
    }
    const v = new vuid();
    const {email,password,display_name} = user
    const passwordError = dbServices.validatePassword(password)
    if(passwordError)
    {
        return response.status(400).json({error:passwordError});
    }
    const id = v.v1();
    const auth_name = `${display_name}#${id}`
    let error;
    const data = await db.raw(`
    INSERT INTO users(display_name,
        auth_name,
        id,
        password,
        email,
        friends,
        friend_requests,
        online_status) VALUES
        (
            '${display_name}',
            '${auth_name}',
            '${id}',
            '${await dbServices.hashPassword(password)}',
            '${email}',
            ARRAY[]::text[],
            ARRAY[]::text[],
            1
        )`).catch((e)=>{
            error = e;
        });
        if(error)
        {
            if(error.constraint == 'users_email_key')
            {
                return response.status(400).json({error:"Email already exists."}); 
            }
        }
        else
        {
            dbServices.login(request, response);
        }


    //db('users').select('email').where({email:email});
},
registerMessage:async function(msg)
{
    if(msg)
    {
        const {id, message, date, channel, sender} = msg;
        return await db.raw(`INSERT INTO messages(id,message,date,channel,sender) VALUES ('${id}','${this.msgProcessor(message)}','${date}','${channel}','${sender}')`);
    }

},
registerChannel:async function(channel)
{
    if(channel)
    {
        const {id, participants, name} = channel
        return await db.raw(`INSERT INTO channels(id,name,participants) values('${id}','${name}',${formatArray(participants)})`);
    }
},
updateChannel:async function(channel)
{
    const {id, participants} = channel
    return await db.raw(`UPDATE channels SET participants = ${formatArray(participants)} WHERE id = '${id}'`);

},
addUserToChannel:async function(auth_name, channel_id)
{
    //console.log(channel_id)
    let data = await db.raw(`SELECT participants FROM channels WHERE id = '${channel_id}'`);
    
    if(data)
    {
        data = data.rows[0];
        if(data)
        {
            let participants = data.participants;
            if(!participants.includes(auth_name))
            {
                participants.push(auth_name)
                dbServices.updateChannel({id:channel_id,participants})
                return participants;
            }
            else
            {
                return {error:`You're already in that channel.`};
            }
        }
        return {error:'channel does not exist'};
    }
    else
    {
        return {error:'channel does not exist'};
    }
    //db.raw(`UPDATE channels SET participants = ARRAY[${participants}] WHERE id = ${id}`);

},
removeUserFromChannel:async function(auth_name, channel_id)
{
    //console.log(channel_id)
    let data = await db.raw(`SELECT participants FROM channels WHERE id = '${channel_id}'`);
    
    if(data)
    {
        data = data.rows[0];
        if(data)
        {
            let participants = data.participants;
            if(!participants.includes(auth_name))
            {
                return {error:`You're not in that channel.`};
                
            }
            else
            {
                let index = participants.indexOf(auth_name);
                participants.splice(index,1);
                dbServices.updateChannel({id:channel_id,participants});
                return participants;
            }
        }
        return {error:'channel does not exist'};
    }
    else
    {
        return {error:'channel does not exist'};
    }
    //db.raw(`UPDATE channels SET participants = ARRAY[${participants}] WHERE id = ${id}`);

},

msgProcessor:(message)=>
{
    const escapeCharacters = ['?'];
    message = message.replace(/'/gi,"''");
    let procStr = "";
    for(let i = 0; i<message.length; i++)
    {
        if(escapeCharacters.includes(message[i]))
        {
            procStr += `\\${message[i]}`
        }
        else
        {
            procStr += message[i];
        }
    }
    //console.log(procStr);
    return procStr;
},
login:async(request, response)=>
{
    const clientManager = request.app.get('cm')
    const {email = '', password = ''} = request.body; 
    let userdata = await db('users').select('*').where({email:email}).catch(e =>{
        response.status(400).json({Auth:"Rejected",error:"Internal server error."});
    });
    

    if(userdata[0])
    {
        const comparePasswords = await authService.comparePasswords(password, userdata[0].password);

        if(comparePasswords)
        {
            const token = uuid();
            const channels = await dbServices.getUserChannels(userdata[0].auth_name);
            userdata[0].token = token;
            userdata[0].channels = channels;
            userdata[0].connection = null;
            clientManager.initClient(userdata[0]);
            //console.log(clientManager);

            const payload = {
                token:token,
                
            }
            const jwtResponse = authService.createJwt(userdata[0].auth_name,payload);

            response.status(200).json({status:"Approved",auth_header:jwtResponse});


        }
        else
        {
            response.status(400).json({status:"Rejected",error:"Incorrect user info."});
        }
    }
    else
    {
        response.status(400).json({status:"Rejected",error:"Incorrect user info."})
    }
    
    
}




};

  module.exports = dbServices;
  