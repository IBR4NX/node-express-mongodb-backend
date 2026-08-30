import {PORT,corsUrl,environment} from './config.js';
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
// import './database/mongooseDB.js';
import './helpers/printStart.js';
const app = express();
app.use(express.json());
// app.use(cors({origin:corsUrl,optionsSuccessStatus:200}));
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, "../views/dist")));
// #######################################################################
const obj={
  name:"Ibovs",
  firstName: "Ibrahim",
	lastName: "Al-Mekhlafi",
	email: "ibovsAdmin@gmail.com",
	password: "000000",
	phone: "738386364",
  job:'student'
}
const article=["How", "to", "make", "a", "website"]

let {email, password, ...rest}=obj
console.log(path.join(__dirname, "../views/dist"))
// console.log(password)
// console.log(type(rest))
// console.log(Array.isArray(rest))
// delete obj.password;
// for(var key in obj){
  //   console.log(`${key}:${obj[key]}`);
  // }

// #######################################################################
app.get('/test', (req, res) => {
  res.render('index.ejs', { name: 'Ibovs', jsons: {name:'Ibovs',firstName:'Ibrahim',lastName:'Al-Mekhlafi',email:'ibovsAdmin@gmail.com',password:'000000',phone:'738386364',job:'student'} });
  res.end();  
});
// app.use('/dist/:url', (req, res) => {
//   const url = req.params.url;
//    res.sendFile(path.join([__dirname], '../views/dist/'+url));
// });
app.get('/login', (req, res) => {
  res.render('login.ejs', { name: 'Ibovs', jsons: {name:'Ibovs',firstName:'Ibrahim',lastName:'Al-Mekhlafi',email:'ibovsAdmin@gmail.com',password:'000000',phone:'738386364',job:'student'} });
});
// console.log(path);
// app.use(express.static(path.join(__dirname, "../views/dist")));
app.use(/.*/, (req, res) => {
  console.log(req.body);
  // delete req.body.password;
  // req.body.name="ibrahim Al-Mekhlafi"
  // for(var key in req.body){
  //   console.log(`${key}:${req.body[key]}`);
  // }
  res.json({message:'test',body:req.body});
});

const start=async()=>{
  const server= await  app.listen(PORT , ()=>{console.log(`\n\x1b[1;32m➜  Server:\x1b[0m is up and running on:\x1b[34m http://localhost:${PORT}/ \x1b[0m  `);});
}
start()




  