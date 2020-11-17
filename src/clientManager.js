const {v4:uuid} = require('uuid');
let dbServices = require('./dbServices');
let clientManager = {
    clients:[],
    channels:[],
    createChannel:function(name = '',participants)
    {
        this.channels.unshift(
            {
                id:uuid(),
                name:name,
                participants:participants,
                clients:[]
            }
        );
    },
    initClient:function(client)
    {
        this.clients.unshift(client);
    },
    findClientByToken:function(token)
    {
        return this.clients.find(client => client.token == token);
    },
    
    sendTo:function(auth_name,data = {})
    {
        let client = this.clients.find(client => client.auth_name == auth_name);
        if(client)
        {
            return (client.connection)? client.connection.send(JSON.stringify(data)) : null;
        }
        else
        {
            return null;
        }
        
    },
    broadcastMessage:function(channel, message, token)
    {
        //console.log(token);
        const sender = this.findClientByToken(token);
        //console.log(this.clients, token);
        
        if(sender)
        {
            

            dbServices = require('./dbServices');
            
            console.log('Broadcasting')
            const msg = {
                id:uuid(),
                message:message,
                channel:channel,
                date:Date.now(),
                sender:sender.auth_name
            }
            
            dbServices.registerMessage(msg);

            this.clients.forEach(client =>{
                if(client.channels.find(channel => channel.id = channel))
                {
                    console.log(client.auth_name);
                    client.connection.send(JSON.stringify(msg))
                }
                
            })
        }
        
    }

}
module.exports = clientManager;