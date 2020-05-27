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

// FS READFILE ONCE

let usersFile;
let tabsFile;
let listFile;

fs.readFile("./data/users.json", (err, data) => {
  if(err){
    console.error(err);
    res.status(500).end();
  }
  usersFile = JSON.parse(data);
})

fs.readFile("./data/tabs.json", (err, data) => {
  if(err){
    console.error(err);
    res.status(500).end();
  }
  tabsFile = JSON.parse(data);
})
fs.readFile("./data/list.json", (err, data) => {
  if(err){
    console.error(err);
    res.status(500).end();
  }
  listFile = JSON.parse(data);
})

// USER HANDLERS (REGISTER / LOGIN)

app.get("/user/:user/pass/:pass", (req, res) => {
  if(req.params.pass && req.params.user){

    if(usersFile[req.params.user]){

      if(usersFile[req.params.user].password === req.params.pass){
        res.status(200).send(usersFile[req.params.user]);
      }else{
        res.status(404).send("passwords do not match")
      }
    }else{
      res.status(404).send("no user by that name")
    }
  }else{
    res.end(400);
  }
})

app.post("/createUser", (req, res) => {
  console.log("data", req.body);
  if(req.body.password && req.body.username){

    let exists = Object.getOwnPropertyNames(usersFile);

    for(let i = 0; i < exists.length; i++){
      if(exists[i] === req.body.username){
        res.status(400).send("user already exists");
        return;
      }
    }

    usersFile[req.body.username] = {
      password : req.body.password,
      ["user-id"] : uuidv4()
    }

    fs.writeFile("./data/users.json", JSON.stringify(usersFile) ,function(err){
      if(err){
        console.error(err);
        res.status(500).end();
      }
      console.log("user created" + req.body.username);
    });

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date+' '+time;

    tabsFile[usersFile[req.body.username]["user-id"]] = [{
      "tab-name" : "dummy tab",
      "tab-id" : uuidv4(),
      "tab-description" : "",
      "tab-date" : dateTime
    }]

    fs.writeFile("./data/tabs.json", JSON.stringify(tabsFile), (err) => {
      if(err){
        console.error(err);
        res.status(500).end();
      }
      console.log("tab created :" + req.body.name);
    })

    res.status(201).send(usersFile);
  }else{
    console.log("does not work")
    res.status(400).end();
  }
})

// TAB HANDELERS (user-id = [{"tab-name" : "","tab-id" : 0,"tab-description" : "", "tab-date" : ""}])

app.post("/createTab", (req, res) => {
  console.log(req.body)
  if(req.body["user-id"] || req.body.name){

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date+' '+time;

    let newID = uuidv4()

    let newItem = {
      "tab-name" : req.body.name,
      "tab-id" : newID,
      "tab-description" : req.body.description,
      "tab-date" : dateTime
    }

    listFile[newID] = [{
      "list-name" : "dummy list",
      "list-id" : uuidv4(),
      "list-description" : "",
      "list-date" : dateTime,
      "list-todos" : []
    }]

    fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
      if(err){
        console.error(err);
        res.status(500).end();
      }
      console.log("list created :" + req.body.name);
    })

    if(tabsFile[req.body["user-id"]]){
      tabsFile[req.body["user-id"]].push(newItem);
        
    }else{
      tabsFile[req.body["user-id"]] = [newItem];
    }

    fs.writeFile("./data/tabs.json", JSON.stringify(tabsFile), (err) => {
      if(err){
        console.error(err);
        res.status(500).end();
      }
      console.log("tab created :" + req.body.name);
    })
    res.status(201).send(newItem);
  }else{
    res.status(404).end();
  }
})

app.get("/userTabs/:id", (req, res) => {
  if(req.params.id){
    if(tabsFile[req.params.id]){
      res.status(200).send(tabsFile[req.params.id]);
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.get("/userTabs/:id/tab/:tabID", (req, res) => {
  if(req.params.id){
    if(tabsFile[req.params.id]){
      for(tab in tabsFile[req.params.id]){
        if(tabsFile[req.params.id][tab]["tab-id"] === req.params["tabID"]){
          res.status(200).send(tabsFile[req.params.id][tab]);
          return;
        }
      }
      res.status(404).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.delete("/userTabs/:id/tab/:tabID", (req,res) => {
  if(req.params.id){
    if(tabsFile[req.params.id]){
      for(tab in tabsFile[req.params.id]){
        if(tabsFile[req.params.id][tab]["tab-id"] === req.params["tabID"]){
          tabsFile[req.params.id].splice(tab, 1);

          fs.writeFile("./data/tabs.json", JSON.stringify(tabsFile), (err) => {
            if(err){
              console.error(err);
              res.status(500).end();
            }
            console.log("tab removed");
          })

          res.status(204).end();
          return;
        }
      }
      res.status(404).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

// LIST HANDELERS (user-id = [{"list-name" : "","list-id" : 0,"list-description" : "", "list-date" : ""}])
// todos : {"todo-name" : "","todo-id" : 0,"todo-description" : "", "todo-date" : ""}

app.post("/createList", (req,res) => {
  console.log(req.body)
  if(req.body["tab-id"] || req.body.name){
    console.log("hello")
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date+' '+time;

    let netItem;
    if(req.body.description){
      newItem = {
        "list-name" : req.body.name,
        "list-id" : uuidv4(),
        "list-description" : req.body.description,
        "list-date" : dateTime,
        "list-todos" : []
      }
    }else{
      newItem = {
        "list-name" : req.body.name,
        "list-id" : uuidv4(),
        "list-description" : "",
        "list-date" : dateTime,
        "list-todos" : []
      }
    }

    if(listFile[req.body["tab-id"]]){
      listFile[req.body["tab-id"]].push(newItem);
        
    }else{
      listFile[req.body["tab-id"]] = [newItem];
    }

    fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
      if(err){
        console.error(err);
        res.status(500).end();
      }
      console.log("list created :" + req.body.name);
    })
    res.status(201).send(newItem);
  }else{
    res.status(404).end();
  }
})

app.get("/tabList/:id", (req, res) => {
  if(req.params.id){
    if(listFile[req.params.id]){
      res.status(200).send(listFile[req.params.id]);
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.get("/tabList/:id/list/:listID", (req, res) => {
  if(req.params.id){
    if(listFile[req.params.id]){
      for(list in listFile[req.params.id]){
        if(listFile[req.params.id][list]["list-id"] === req.params["listID"]){
          res.status(200).send(listFile[req.params.id][list]);
          return;
        }
      }
      res.status(400).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.delete("/tabList/:id/list/:listID", (req, res) => {
  if(req.params.id){
    if(listFile[req.params.id]){
      for(list in listFile[req.params.id]){
        if(listFile[req.params.id][list]["list-id"] === req.params["listID"]){
          listFile[req.params.id].splice(list, 1);

          fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
            if(err){
              console.error(err);
              res.status(500).end();
            }
            console.log("list deleted");
          })

          res.status(204).end();
          return;
        }
      }
      res.status(400).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.put("/tabList/:id/list/:listID", (req, res) => {

  if(req.body.name && req.params.id || req.body.desc && req.params.id){
    if(listFile[req.params.id]){

      for(list in listFile[req.params.id]){
        if(listFile[req.params.id][list]["list-id"] === req.params["listID"]){

          if(req.body.name){
            listFile[req.params.id][list]["list-name"] = req.body.name;
          }

          if(req.body.desc){
            listFile[req.params.id][list]["list-description"] = req.body.desc;
          }

          fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
            if(err){
              console.error(err);
              res.status(500).end();
            }
            console.log("list deleted");
          })

          res.status(204).end();
          return;
        }
      }
      res.status(400).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

// TODO HANDELERS

app.post("/tabList/:id/List/:listID/createTodo", (req, res) => {
  if(req.params.id && req.params.listID && req.body.name){

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date+' '+time;

    let newTodo = {
      "todo-name" : req.body.name,
      "todo-id" : uuidv4(),
      "todo-description" : req.body.description,
      "todo-date" : dateTime,
    }

    for(list in listFile[req.params.id]){
      if(listFile[req.params.id][list]["list-id"] === req.params.listID){
        listFile[req.params.id][list]["list-todos"].push(newTodo);
      }
    }

    fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
      if(err){
        console.error(err);
        res.status(500).end();
      }
      console.log("todo added");
    })

    res.status(201).send(newTodo);
    return;
  }else{
    res.status(400).end();
  }
})

app.get("/tabList/:id/list/:listID/todo/:todoID", (req, res) => {
  if(req.params.id && req.params.listID && req.params.todoID){
    console.log(req.params.listID)
    if(listFile[req.params.id]){

      for(list in listFile[req.params.id]){

        if(listFile[req.params.id][list]["list-id"] === req.params.listID){
          
          for(todo in listFile[req.params.id][list]["list-todos"]){

            if(listFile[req.params.id][list]["list-todos"][todo]["todo-id"] === req.params.todoID){
              res.status(200).send(listFile[req.params.id][list]["list-todos"][todo]);
              return;
            }
          }
        }
      }

      res.status(400).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.delete("/tabList/:id/list/:listID/todo/:todoID", (req, res) => {
  if(req.params.id && req.params.listID && req.params.todoID){

    console.log("ID TO DELETE", req.params.todoID);

    if(listFile[req.params.id]){

      for(list in listFile[req.params.id]){

        if(listFile[req.params.id][list]["list-id"] === req.params.listID){

          for(todo in listFile[req.params.id][list]["list-todos"]){

            if(listFile[req.params.id][list]["list-todos"][todo]["todo-id"] === req.params.todoID){

              listFile[req.params.id][list]["list-todos"].splice(todo, 1);

              fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
                if(err){
                  console.error(err);
                  res.status(500).end();
                }
                console.log("todo deleted");
              })

              res.status(204).end();
              return;
            }
          }
        }
      }
      res.status(400).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.put("/tabList/:id/list/:listID/todo/:todoID", (req, res) => {

  if(req.body.name && req.params.id || req.body.desc && req.params.id){
    if(listFile[req.params.id]){

      for(list in listFile[req.params.id]){

        if(listFile[req.params.id][list]["list-id"] === req.params.listID){

          for(todo in listFile[req.params.id][list]["list-todos"]){

            if(listFile[req.params.id][list]["list-todos"][todo]["todo-id"] === req.params.todoID){

              if(req.body.name){
                listFile[req.params.id][list]["list-todos"][todo]["todo-name"] = req.body.name;
              }
    
              if(req.body.desc){
                listFile[req.params.id][list]["list-todos"][todo]["todo-description"] = req.body.desc;
              }
    
              fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
                if(err){
                  console.error(err);
                  res.status(500).end();
                }
                console.log("todo changed");
              })
    
              res.status(204).end();
              return;

            }
          }
        }
      }
      res.status(400).end();
    }else{
      res.status(404).end();
    }
  }else{
    res.status(400).end();
  }
})

app.put("/moveTodo/:id/todo/:todoID/from/:listIDFrom/to/:listIDTo", (req, res) => {
  if(req.params.listIDFrom && req.params.todoID){
    let moveTodo;


    // FIND TODO, SAVE TODO AND DELETE old TODO
    for(list in listFile[req.params.id]){
      if(moveTodo){
        break;
      }

      if(listFile[req.params.id][list]["list-id"] === req.params.listIDFrom){

        for(todo in listFile[req.params.id][list]["list-todos"]){

          if(listFile[req.params.id][list]["list-todos"][todo]["todo-id"] === req.params.todoID){
            moveTodo = listFile[req.params.id][list]["list-todos"][todo];

            listFile[req.params.id][list]["list-todos"].splice(todo, 1);
            break;
          }
        }
      }
    }

    // PLACE TODO TO ITS NEW PLACE
    for(list in listFile[req.params.id]){

      if(listFile[req.params.id][list]["list-id"] === req.params.listIDTo){
        listFile[req.params.id][list]["list-todos"].push(moveTodo);


        fs.writeFile("./data/list.json", JSON.stringify(listFile), (err) => {
          if(err){
            console.error(err);
            res.status(500).end();
          }
          console.log("todo moved");
        })

        res.status(204).end();
        return;
      }
    }
  }else{
    res.status(400).end();
  }
})

app.listen("4050", () => {
  console.log("listening on 4050");
})