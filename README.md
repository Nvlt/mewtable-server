# Mewtable  
[Mewtable](https://mewtable.vercel.app/ "Mewtable") ||
[Client GitHub](https://github.com/Nvlt/Mewtable "Client GitHub") ||
[API GitHub](https://github.com/Nvlt/mewtable-server "API Github")  
By: [Alexis Felts](https://github.com/Nvlt "Alexis Felts")


## About Mewtable:
Mewtable is a basic chat application where users can create public channels and chat in them with others.  


## API Endpoints:  


### '/api/user Authenticated GET'
This endpoint is used for getting all of the user's data after logging in.
### '/api/channels Authenticated POST'
On this endpoint we can post to create a new channel.
### '/api/channels Authenticated PATCH'
On this end point we can add or remove a user as a participant of an existing channel.
### '/api/login public POST'
On this end point we can post our email and password to login.
### '/api/register public POST'
On this end point we can post our email, display name, and password to register.


## Technologies Used:  
FrontEnd: JavaScript, React, CSS 3, HTML 5, and Jest.  

BackEnd: Node.js, Express.js, PostgreSQL, Mocha & Chai.