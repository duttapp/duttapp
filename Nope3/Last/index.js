require("dotenv").config()
const https = require('https')
const fs = require('fs')
const CNTRL = require('express')
const JSON = require('json')
const session = require('express-session')
const MSSQLStore = require('express-mysql-session')(session)
const cookieParser = require('cookie-parser')
const UserVerify = require('./Classes/DB.js')




const PORT = 9012
const TWO_HOURS = 1000 * 60 * 60 * 2
const options = {
	key: fs.readFileSync('https/key.pem'),
	cert: fs.readFileSync('https/cert.pem')
}
const app =  CNTRL()

//session check
let Session_Check = async (req,res,next)=>{

	      try{
                
	            let cookieSessionID = req.signedCookies.Session
	            let getUserID = await UserVerify.sessionData(cookieSessionID)         
                if(getUserID.session_id == cookieSessionID){
                	 console.log("Session found in database ")
                	 res.sendFile(__dirname + "/html/Control.html")
                
                }
                else  next()

	            } catch {

                  next() 
	            }
 
                
        }
let Demo = async (req,res,next)=>{

	      try{
                console.log("First Function")
                next()
              }
	            catch {

                  next() 
	            }
 
         }

//session check

// Creating session Start

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


//app.use(Session_Check)
app
.route("/Control")
.post(Session_Check,async(req,res)=> {

try{
     
     let Username = req.body.Username
     let Password = req.body.Password
     let isVerify = await UserVerify.ValidUser(Username,Password)
     let getUser = await UserVerify.getUserByUsername(Username)
     req.session.cookie.path = `/Control/:${Username}`
     req.session.user = getUser.ID
     console.log("Authenticated")
	 res.sendFile('/html/Control.html',{root:__dirname})
 } catch {

 	console.log("error: User validation failed")
	res.status(401).redirect('/')
 
 }
	 
})

app
.route("/registration.html")
.get((req,res)=> {
    
         res.sendFile(__dirname+'/html/registration.html')
        
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
.route("/Control/Styles_1.css")
.get((req,res)=> {
   res.sendFile('/Styles/Styles_1.css',{root:__dirname})
  	
})

app
.route("/LogOut/Control/:User")
.post((req,res)=>{
	let User = req.params.User
	let cookieSession = req.signedCookies.Session
	console.log(cookieSession)
	req.session.destroy(cookieSession,function(err) {
    if(err) console.log(err.message)
    else {
    	res.clearCookie('Session',{path: `/Control/?User=${User}`})
        res.redirect('/')

       }

  })
	
	                
})

// Express Routing End


// Create https Server and assgning port

var Server = https.createServer(options,app);

Server.listen(PORT, ()=>{
	console.log(`Server is running on port ${PORT}`);
});

// Create https Server and assgning port End

app.use((err,req,res,next)=>{

    console.log(err.message)
	res.status(500).redirect("/")
})




