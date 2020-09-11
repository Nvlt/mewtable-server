const app = require('./app');
const {PORT} = require('./config');
const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({server});
const clientManager = require('./clientManager');
function main()
{
    console.log(`Listening on port:${PORT}`,require('./config'))
    
}

wss.on('connection', (client)=>{

    client.send('Checking credentials.');
    client.once('message', (data)=>
    {
        let {authToken} = JSON.parse(data);
        let storedClient = clientManager.findClientByToken(authToken);
        //console.log(data, storedClient);
        if(!storedClient)
        {
            client.send('Unauthorized');
            client.close();
        }
        else
        {
            client.send(`Authorized`);
            storedClient.connection = client;
            storedClient.connection.on('message',(data)=>{
                if(data)
                {
                    const type = JSON.parse(data).type;
                    if(type == 'message')
                    {
                        const {authToken,message,channel_id} = JSON.parse(data);
                        clientManager.broadcastMessage(channel_id,message,authToken);
                        
                    }
                    
                }
                
                

                
                
            })
        }

        
        
    });
    client.on('close',()=>{
        console.log('connection closed.');
    })
});
wss.on('close' ,()=>{
    console.log('Connection closed');

})





server.listen(PORT,main)