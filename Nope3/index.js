'use strict'
require("dotenv").config()
const https = require('https') 
const fs = require('fs')
const CNTRL = require('express')
const session = require('express-session')
const MSSQLStore = require('express-mysql-session')(session)
const cookieParser = require('cookie-parser')
const UserVerify = require('./Classes/DB.js')
const Expressws = require('express-ws')
const WS = require('ws')



let WSC
var Data_Client
var Data_Server
var Clients = []
const options = {
	key: fs.readFileSync('https/key.pem'),
	cert: fs.readFileSync('https/cert.pem')
}
const app =  CNTRL()
var Server = https.createServer(options,app)
var expressWS = new Expressws(app,Server)


function Connect(){ 
    WSC = new WS("ws://192.168.43.240:81")
    
   
    WSC.on('message',(msg)=>{
        
        console.log(msg)
        Data_Server = msg
    
     })
     
     WSC.on('close',()=>{

        setTimeout(Connect,10000)
    
     })
    
     WSC.on('error',(err)=>{
        WSC.close()
        console.log(err.message)    
        
     })
}
Connect()

const PORT = 9012
const TWO_HOURS = 1000 * 60 * 60 * 2



//session check
let Session_Check =async (req,res,next)=>{

	      try{

                let LogIn = req.query.LogIn
                let LogOut = req.query.LogOut
                if(LogIn){
	            let cookieSessionID = req.signedCookies.Session
	            let getUserID = req.sessionID        
                if(getUserID == cookieSessionID){
                	 console.log("Session found in database ")
                	 res.sendFile(__dirname + "/html/Control.html")
                     
                }
                else {
                 
                  	next()
                }  

	            }
	            else if(LogOut){
                      
                     
                      next()
	            }
	            else{}
	            } catch {

                  next() 
	            }
 
                
        }

   let VerifyUser = (ws,req,next)=>{

            let cookieSessionID = req.signedCookies.Session
	        let getUserID = req.sessionID        
                if(getUserID == cookieSessionID){
                	 console.log("WebSocket Connected")
                     next()
                     
                }
                else {
                 
                  	ws.send("Connection Denied")
                }  
                            
          
        }


//session check

// Creating session Start
app.use((req,res,next)=>{
  
    console.log(req.url)
    next()
})
app.use(cookieParser(process.env.SESS_SECRET))
app.use(CNTRL.urlencoded({ extended: false }))



const config = {
	connectionLimit:process.env.CON_LIMIT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
   host: process.env.DB_HOST,
	database: process.env.MYSQL_DB,
	port: process.env.DB_PORT,
	createDatabaseTable: true

	
}

const sessionstore = new MSSQLStore(config)
app.use(session({

	 name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionstore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: true
    }

   }))

// Creating session End

// Express Routing



app.get("/",(req,res)=>{

   
	res.sendFile('/html/index.html',{root:__dirname})
	
})

app
.route("/Control:Username")
.post(Session_Check,async(req,res)=> {

try{
     let LogIn = req.query.LogIn
     let LogOut = req.query.LogOut
     var Username = req.body.Username
     var Password = req.body.Password
     if(LogIn){

     let isVerify = await UserVerify.ValidUser(Username,Password)
     let getUser = await UserVerify.getUserByUsername(Username)
     req.session.cookie.path = "/Control/"+ getUser.ID
     req.session.user = getUser.ID
     Clients.push(Username)
     console.log("Authenticated")
	  res.sendFile('/html/Control.html',{root:__dirname})

	  }
	 else if(LogOut){
    res.clearCookie('Session',{path: "/Control"})
	 req.session.destroy(function(err) {
     if(err) console.log(err.message)
     else {
      Clients.pop(Username)
      res.redirect('/')
      console.log(Username+",Logged Out")
      }

    })

	}else{}
 } catch(err){

 	console.log(`error: User validation failed, reason:${err.message}`)
	res.status(401).redirect('/')
 
 }	 
})
app
.route("/registration.html")
.get((req,res)=> {
    
         res.sendFile('/html/registration.html',{root: __dirname})
        
    })
.post((req,res)=> {

          let UserCheck = UserVerify.InsertUser(req.body.Name,req.body.Username,req.body.Mobile_no,req.body.Email_ID,req.body.Password)
          UserCheck.then((data)=>{ 
          	res.send("<h1>User Created</h1>")
          	
         }).catch((err)=>{
          	console.log(err.message)
          	res.send(`<h1>${err.message}</h1>`)
          	
          })
	
})

app
.route("/Styles.css")
.get((req,res)=> {
   res.sendFile('/Styles/Styles.css',{root:__dirname})
   
	
})
app
.route("/Styles_2.css")
.get((req,res)=> {
   res.sendFile('/Styles/Styles_2.css',{root:__dirname})
   
	
})


app
.route("/Control/Styles_1.css")
.get((req,res)=> {
   res.sendFile('/Styles/Styles_1.css',{root:__dirname})
  	
})
app
.route("/Control/Client.js")
.get((req,res)=> {
   res.sendFile('/jsfiles/Client.js',{root:__dirname})
  	
})

app
.route("/Control/Node_1.xml")
.get((req,res)=> {
  
   res.status(200).sendFile('/XML/Node_1.xml',{root:__dirname})
  	
})
app
.route("/Control/Node_2.xml")
.get((req,res)=> {
  
   res.status(200).sendFile('/XML/Node_2.xml',{root:__dirname})
  	
})
app
.route("/Control/Node_3.xml")
.get((req,res)=> {
  
   res.status(200).sendFile('/XML/Node_3.xml',{root:__dirname})
  	
})
app
.route("/Control/Node_4.xml")
.get((req,res)=> {
  
   res.status(200).sendFile('/XML/Node_4.xml',{root:__dirname})
  	
})
app
.route("/Control/Node_5.xml")
.get((req,res)=> {
  
   res.status(200).sendFile('/XML/Node_5.xml',{root:__dirname})
  	
})


app.ws('/Control',VerifyUser,(ws,req)=>{
   
       setInterval(()=>{

             ws.send(Data_Server)

      },2000)


ws.on('message',(msg)=>{
          try{
          Data_Client = msg
          WSC.send(Data_Client)
          console.log(msg)
          }
          catch(err){
            console.log(err.message)

          }
       
})
ws.on('close',()=>{
          console.log("WebSocket Closed")
})
ws.on('error',(err)=>{

    console.log(err.message)
})
})


// Express Routing End


// Create https Server and assgning port

Server.listen(PORT, ()=>{
	console.log(`Server is running on port ${PORT}`)
})
// Create https Server and assigning port End

app.use((err,req,res,next)=>{

    console.log(err.message)
	res.status(500).redirect('/')
})




