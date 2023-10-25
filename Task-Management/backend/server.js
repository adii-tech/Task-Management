//importing servers
const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const jwt= require('jsonwebtoken');
var bodyParser = require('body-parser');

const app = express();
const secretKey="secretKey";

app.use(cors());
app.use(express.json());

const db = mysql.createConnection(
    { 
        host: "localhost", 
        user: "root", 
        password: "", 
        database: "signup"
    }
    )
    // sign in first post
app.post('/signup', (req, res) => {    
   const sql1= "SELECT email FROM login WHERE email= ?";

   db.query(sql1, [req.body.email], (error, result)=>{
     if(error){
        console.log(error)
     }
     if(result.length > 0){ 
        return res.json('user alrady register'); 
     }
     else{
        const sql = "INSERT INTO login (name,email,password) VALUES (?)"; 
        const values = [req.body.name,  
                         req.body.email, 
                         req.body.password]  
     
                        
     db.query(sql, [values], (err, data) => { 
         if(err) {  
             return res.json("Error"); 
         }
         return res.json({...data, d1:{name:req.body.name, email:req.body.email, password:req.body.password}});
          })

     }

   })

   

})

// log in second post
app.post('/login',[ check('email', "Emaill length error").isEmail().isLength({min: 10, max:30}),    
                    check('password', "password length 8-10").isLength({min: 8, max: 10})], 
                (req, res) => {    
                    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";

                    db.query(sql, [req.body.email,req.body.password ], 
                              (err, data) => {
                                  const errors = validationResult(req);  
                                 // console.log(data);     
                                   if(!errors.isEmpty()) {           
                                     return res.json(errors);        
                                    } 
                                   else {           
                                         if(err) {  return res.json("Error");  } 

                                         if(data.length > 0) { 
                                          const id= data[0].id;
                                          const token = jwt.sign({id},'your-secret-key');
                                            return res.json({Login:true, token, data});            
                                         } else {               
                                             return res.json("Faile");           
                                             }      
                                        }          
                                              })
                                            })

//third post
app.post('/adminl',[ check('email', "Emaill length error").isEmail().isLength({min: 10, max:30}),    
          check('password', "password length 8-10").isLength({min: 8, max: 10})],
          (req, res) => {    
            const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";

            db.query(sql, [req.body.email,req.body.password ], 
                      (err, data) => {
                          const errors = validationResult(req);  
                         // console.log(data);     
                           if(!errors.isEmpty()) {           
                             return res.json(errors);        
                            } 
                           else {           
                                 if(err) {  return res.json("Error");  } 

                                 if(data.length > 0) { 
                                  const id= 100;
                                  const token = jwt.sign({id},'your-secret-key');
                                    return res.json({Login:true, token, data});            
                                 } else {               
                                     return res.json("Faile");         
                                     }      
                                }          
                                      })
                                    })

// get
   app.get('/users',(req, res)=>{
    const sql = "SELECT * FROM login";   
    db.query(sql, (err, data) => {
      if(err) {  return res.json("Error");
    }else{
          res.json(data);
      }
    })
   }) 
   
 //post
 app.post('/settask',(req, res)=>{
      const sql="INSERT INTO tasks (email, description, start_date, end_date) VALUES (?)";
      const values = [req.body.email,  
        req.body.description, 
        req.body.start_date,req.body.end_date]; 
        //console.log(req.body.start_date);

        db.query(sql, [values], (err, data) => { 
          //console.log(err);
          if(err) {  
              return res.json("Error"); 
          }
            return res.json({...data});
           })
 })  

 //post
 app.post('/home',
    (req, res)=>{
  const sql = "SELECT * FROM tasks WHERE email=?";
 // console.log(req.body)   
  db.query(sql,[req.body.email], (err, data) => {
    if(err) {  return res.json("Error");
  }else{
        res.json(data);
    }
  })
 }) 

app.listen(8081, ()=> { 
              console.log("listening");
            })