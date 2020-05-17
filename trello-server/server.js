const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// MIDDLEWARES

app.use(express.urlencoded());

app.use((req, res, next) => {
  if(req.is("json")) {
    console.log("hell0?")
    let data = "";
    req.on("data", chunk => {
      data += chunk.toString();
      console.log(chunk.toString());
    })
    req.on("end", () => {
      try {
        let newData = JSON.parse(data);
        req.body = newData;
        next();
      } catch(e) {
        res.status(400).end("but why?");
      }
    })
  } else {
    next();
  }
})

app.use((req, res, next) => {
  let time = new Date;
  res.on("finish", () => {
    let f = new Date;
    console.log(req.method + " " + req.url + " " + res.statusCode + " " + (f - time) + "ms")
  })
  next();
})

// USER HANDLERS

app.get("/user/:user/pass/:pass", (req, res) => {
  if(req.params.pass && req.params.user){
    fs.readFile("./data/users.json", (err, data) => {
      if(err){
        res.status(500).end();
      }
      let parsed = JSON.parse(data);
      
      if(parsed[req.params.user]){
        if(parsed[req.params.user].password === req.params.pass){
          res.status(200).send(parsed[req.params.user]);
        }else{
          res.status(404).send("passwords do not match")
        }
      }else{
        res.status(404).send("no user by that name")
      }
    })
  }else{
    res.end(400);
  }
})

app.post("/createUser", (req, res) => {
  console.log("data", req.body);
  if(req.body.password && req.body.username){
    fs.readFile("./data/users.json", (err, data) => {
      if(err){
        res.status(500).end();
      }
      let parsed = JSON.parse(data);
      let exists = Object.getOwnPropertyNames(parsed)

      for(let i = 0; i < exists.length; i++){
        if(exists[i] === req.body.username){
          res.status(400).send("user already exists");
          return;
        }
      }

      parsed[req.body.username] = {
        password : req.body.password,
        ["user-id"] : uuidv4()
      }

      fs.writeFile("./data/users.json", JSON.stringify(parsed) ,function(err){
        console.log("user created" + req.body.username);
      });
      res.status(200).send(parsed);
    })
  }else{
    console.log("does not work")
    res.status(400).end();
  }
})

app.listen("4050", () => {
  console.log("listening on 4050");
})