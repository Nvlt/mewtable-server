const app = require('./app');
const {PORT} = require('./config');
const WebSocket = require('ws');
const atob = require('atob');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({server});
const clientManager = app.get('cm');
function main()
{
    console.log(`Listening on port:${PORT}`,`http://localhost:${PORT}/`)
    
}
wss.on('connection', (client)=>{

    client.send('Checking credentials.');
    client.once('message', (data)=>
    {
        let {authToken} = JSON.parse(data);
        
        authToken = authToken.split('.');
        
        if(!authToken[1])
        {
            client.send('Unauthorized');
            client.close();
        }
        let token = JSON.parse(atob(authToken[1])).token
        let storedClient = clientManager.findClientByToken(token);
        //console.log(data, storedClient);
        if(!storedClient)
        {
            client.send()
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
                    
                    data = JSON.parse(data);
                    
                    const type = data.type;
                    
                    if(type == 'message')
                    {
                         let {authToken,message,channel_id} = data
                        if(authToken)
                        {
                            let payload = authToken.split('.');
                            if(payload[1])
                            {
                                authToken = JSON.parse(atob(payload[1])).token;
                                //console.log(data);
                                clientManager.broadcastMessage(channel_id,message,authToken);
                            }
                        }
                         
                        
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
module.exports = app;