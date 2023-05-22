require("dotenv").config()
const dB = require('mysql')
const bcrypt = require('bcrypt')



const config = {
	connectionLimit:process.env.CON_LIMIT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
    host: process.env.DB_HOST,
	database: process.env.MYSQL_DB,
	port: process.env.DB_PORT,

}

const dBConn = dB.createPool(config)

module.exports.ValidUser = function ValidUser(User,Password){

	return new Promise((resolve,reject)=>{


	let hash = dBConn.query(`SELECT Password FROM users WHERE Username= '${User}'`, (err,hash)=>{

	
		if (err) console.log(err.message)
	      else if(hash.length !== 0) {
             
                     hash_str = hash[0].Password
                     bcrypt.compare(Password,hash_str,(err,result)=>{

            	        if(err) console.log(err.message) 
            		   else if(result) resolve(result)
            		     else reject(new Error('Login Failed'))
                   })
	    	

	    } else reject("User not found")

	    	
	})
    
	
  })
}

module.exports.InsertUser = function InsertUser(Name,User,Mobile_No,Email_ID,Password) {

	     return new Promise((resolve,reject)=>{

		 dBConn.query(`SELECT * FROM users WHERE Username = '${User}' OR Mobile_no = '${Mobile_No}' OR Email_ID = '${Email_ID}'`,(err,result)=>{
         
         if(err) console.log(err.message)
         else if(result.length !== 0) reject(new Error("User Already exists"))
         else {

         	    bcrypt.genSalt(10, (err,salt)=>{
            
                 if(err) console.log(err.message)

                     else bcrypt.hash(Password,salt,(err,hash)=>{

                 	  if(err) console.log(err.message)
                 		
                 		else {

                 			
                 			dBConn.query(`INSERT INTO users(Name,Username,Mobile_no,Email_ID,Password) VALUES ('${Name}','${User}','${Mobile_No}','${Email_ID}','${hash}')`,(err,result)=>{

                 				if(err) console.log(err.message)
                 					else {
                 						resolve(result.insertID)
                 					   
                 					}

                                    })

                 		}

                           })

			

		         })


              }

	      })

		
	})

}

module.exports.getUserByUsername = (Username)=>{

	return new Promise((resolve,reject)=>{

		dBConn.query(`SELECT * FROM users WHERE Username = '${Username}'`,(err,result)=>{

			if(err) reject(err)
				else resolve(result[0])
		})
	})

}

module.exports.getUserByID = (ID)=>{

	return new Promise((resolve,reject)=>{

		dBConn.query(`SELECT * FROM users WHERE ID = '${ID}'`,(err,result)=>{

			if(err) reject(err)
				else resolve(result[0])
		})
	})

}









