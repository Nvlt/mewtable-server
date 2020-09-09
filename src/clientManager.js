const {v4:uuid} = require('uuid');
const dbServices = require('./dbServices');
const clientManager = {
    clients:[
        
    ],
    channels:[
        {
            id:'fasfsafaf',
            name:'',
            participants:[],
            clients:[]
        }
    ],
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
    broadcastMessage:function(channel, message, token)
    {
        const sender = this.findClientByToken(token);
        console.log(this.clients, token);
        if(sender)
        {
            console.log('Broadcasting')
            this.clients.forEach(client =>{
                if(client.channels.find(channel => channel.id = channel))
                {
                    const msg = {
                        id:uuid(),
                        message:message,
                        channel:channel,
                        date:Date(),
                        sender:sender.auth_name
                        
                    }
                    
                    client.connection.send(JSON.stringify(msg))
                    dbServices.registerMessage(msg);
                }
                
            })
        }
        
    }

}
module.exports = clientManager;