const app = require('express')
const ws = require('express-ws')(app);

module.exports.WebSocket = function(server){
 
    app.ws('/Node1',(ws,req)=>{

        ws.on('message',(msg,)=>{
           console.log(msg)
        })
        ws.send("Welcome")
     
     })
    }
