import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from 'react-router-dom';

import {tabinfo, newtab, newList, listinfo, newtodo, todoinfo} from "./miniComp/modals";

const Wrapper = styled.main`
  width: ${window.innerWidth * 0.8}px;
  height: ${window.innerHeight * 0.8}px;
  position: absolute;
  left: ${window.innerWidth * 0.1}px;
  top: ${window.innerHeight * 0.15}px;
  border: 1px solid gray;
  border-radius: 10px;
  display:flex;
  align-items: flex-start;
  z-index: 2;
  background-color: white;

  .list{
    margin-left: 5px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 299px;
    height: auto;
    border: 1px solid gray;
    padding-bottom: 10px;
    border-radius: 10px;
    pointer-events: all;
    transition: all 0.3s ease-out;
    position: relative;
  }
  .list > span{
    pointer-events: ${(props) => props.isDragging ? "none;" : "all;"}
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .list > span:hover{
    cursor: pointer;
    color : rgb(41, 133, 185);
  }
  .todo{
    width: 270px;
    height: 34px;
    border: 1px solid gray;
    margin-top: 10px;
    border-radius: 10px;
    padding-left: 10px;
    padding-top: 6px;
    text-align: left;
    pointer-events: ${(props) => props.isDragging ? "none;" : "all;"}
    z-index: ${(props) => props.isDragging ? "-2;" : "1;"};
    padding-bottom: 0 !Important;
    position: relative;
  }
  .dragTodo{
    width: 270px;
    height: 34px;
    border: 1px solid gray;
    margin-top: 10px;
    border-radius: 10px;
    padding-left: 10px;
    padding-top: 6px;
    text-align: left;
    padding-bottom: 0 !Important;
  }
  .todo:hover{
    background-color: rgba(41, 133, 185, 0.1);
    border: 1px solid rgb(41, 133, 185);
  }
  .todo > span{
    position: absolute;
    right: 10px;
    color: gray;
  }
  .todo > span:hover{
    position: absolute;
    right: 10px;
    color: rgb(41, 133, 185);
    cursor: pointer;
  }
  .list-start{
    width: 280px;
    height: 40px;
    margin-top: 10px;
    pointer-events:none;
  }
  .list-start > h3{
    margin: 0;
    pointer-events:none;
  }
  .tabs{
    width: auto;
    height: 40px;
    position: absolute;
    top: -42px;
    left: 10px;
    z-index: -2;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

  }
  .tab{
    width: auto;
    height: 40px;
    border: 1px solid gray;
    border-bottom: 0px;
    background-color: rgba(255,255,255,.5);
    margin-right: 5px;
    border-radius: 10px 10px 0px 0px;
    opacity: 0.8;
    color: gray;
  }
  .selectedTab{
    width: auto;
    height: 40px;
    border: 1px solid gray;
    border-bottom: 1px solid white;
    background-color: rgba(255,255,255,1);
    margin-right: 5px;
    border-radius: 10px 10px 0px 0px;
    z-index: 2;
    color: darkgray;
    pointer-events:none;
  }
  .newTab{
    position:relative;
    top: 6px;
    left: 5px;
    width: 25px;
    height: 25px;
    border: 1.5px solid gray;
    background-color: rgba(255,255,255,.5);
    margin-right: 5px;
    border-radius: 30px 30px 30px 30px;
  }
  .newTab > span{
    font-size: 20px;
    position: relative;
    top: 2.5px;
    color: gray;
  }
  .newTab:hover{
    background-color: rgba(41, 133, 185, 0.1);
    border: 1.5px solid rgb(41, 133, 185);
  }
  .newTab:hover > span{
    color: rgb(41, 133, 185);
  }
  .newList{
    position:relative;
    top: 6px;
    left: 5px;
    width: 300px;
    height: 60px;
    border: 0.5px solid lightgray;
    background-color: rgba(255,255,255,.5);
    margin-right: 5px;
    border-radius: 10px;
    display:flex;
    justify-content: center;
    align-items:center;
  }
  .newList > span{
    font-size: 20px;
    color: gray;
  }
  .newList:hover{
    background-color: rgba(41, 133, 185, 0.1);
    border: 0.5px solid rgb(41, 133, 185);
  }
  .newList:hover > span{
    color: rgb(41, 133, 185);
  }

  .newTodo{
    position:relative;
    top: 6px;
    left: 5px;
    width: 270px;
    height: 34px;
    border: 0.5px solid lightgray;
    background-color: rgba(255,255,255,.5);
    margin-right: 5px;
    border-radius: 10px;
    display:flex;
    justify-content: center;
    align-items:center;
    pointer-events: ${(props) => props.isDragging ? "none;" : "all;"}
    order: 1;
  }
  .newTodo > span{
    font-size: 20px;
    color: gray;
  }
  .newTodo:hover{
    background-color: rgba(41, 133, 185, 0.1);
    border: 0.5px solid rgb(41, 133, 185);
  }
  .newTodo:hover > span{
    color: rgb(41, 133, 185);
  }

  .tab:hover{
    background-color: rgba(41, 133, 185, 0.1);
    border: 1px solid rgb(41, 133, 185);
    border-bottom: 0px;
  }
  .tab > h4{
    pointer-events:none;
    position: relative;
    left: 10px;
    top: -5px;
    padding-left: 30px;
    padding-right: 30px;
    margin-top: 5px;
  } 
  .selectedTab > h4{
    pointer-events:none;
    position: relative;
    left: 10px;
    top: -5px;
    padding-left: 30px;
    padding-right: 30px;
    margin-top: 5px;
  }
  .tab > h4 > span{
    pointer-events:none;
    color: rgba(0,0,0,0);
    position: relative;
    left: 20px;
    top: 0px;
  }
  .selectedTab > h4 > span{
    pointer-events: all;
    position: relative;
    left: 20px;
    top: 0px;
  }
  .selectedTab > h4 > span:hover{
    color: rgb(41, 133, 185);
    cursor: pointer;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }

  .modal{
    position: fixed;
    top: 0;
    left: 0;
    width: ${window.innerWidth}px;
    height: ${window.innerHeight}px;
    z-index: 5;
    background-color: rgba(0,0,0,0.2);
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .modalWrapper{
    position: relative;
    width: 400px;
    height: 500px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 10px;
    display:flex;
    align-items: center;
    flex-direction: column;
  }
  .modalForm{
    display:flex;
    flex-direction: column;
    width: 300px;
  }
  .modalForm > input{
    border-radius: 20px;
    border:1px solid gray;
    padding: 4px;
    text-align: center;
    outline: none;
  }
  .modalForm > textarea{
    max-width: 300px;
    min-width: 300px;
    max-height: 250px;
    min-height: 250px;
    height: 250px;
  }
  .modalForm > label{
    margin-top: 10px;
  }
  .buttons{
    position: absolute;
    bottom: 10px;
    margin-top: 10px;
    width: 300px;
    display:flex;
    justify-content: space-around;
  }
  .buttons > button{
    margin-top: 10px;
    border: 1px solid gray;
    border-radius: 10px;
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
  }
`

function TodosComp(props){
  const [isDragging, setDragging] = useState(false);
  const [isRedirect, setRedirect] = useState(false);

  const [tabs, setTabs] = useState([]);

  const [lists, setLists] = useState([]);
  const [newListValues, setListValues] = useState({});

  const [todoValues, setTodoValues] = useState({});

  const [selectedList, setSelectedList] = useState();

  const [openModal, setModal] = useState(false);
  const [sendInfo, setInfo] = useState({name : "", description : "", type : ""})
  const [selectedTab, setSelectedTab] = useState("");

  const [gotInfo, setGotInfo] = useState("");

  const [moveInfo, setMoveInfo] = useState({todoID : "", fromID : "", toID : ""})

  useEffect(() => {
    let storage = JSON.parse(localStorage.getItem("user-id"));
    if(storage){
      axios.get("/userTabs/" + storage.id)
      .then((res) => {
        console.log(res);
        setTabs(res.data);
        setSelectedTab(res.data[0]["tab-id"])

        console.log(res.data[0]["tab-id"])
        axios.get("/tabList/" + res.data[0]["tab-id"])
        .then((response) => {
          console.log(response);
          setLists(response.data);
        })
      })
      .catch((err) => {
        console.error(err);
      })
    }else{
      console.log("not logged in")
      setRedirect("login");
    }
  }, [])

  if(isRedirect === "login"){
    return(<Redirect to={"/login"} />);
  }

  const switchTab = (e) => {
    e.stopPropagation();
    setSelectedTab(e.target.id);
    axios.get("/tabList/" + e.target.id)
    .then((response) => {
      console.log(response);
      setLists(response.data);
    })
  }

  const newTab = (e) => {
    setModal("newTab");
    let newInfo = {...sendInfo};
    newInfo.type = "/createTab";
    setInfo(newInfo);
  }

  const createList = (e) => {
    setModal("newList");
    let newInfo = {...sendInfo};
    newInfo.type = "/createList";
    setInfo(newInfo);
  }

  const tabInfo = (e, tabID) => {
    let storage = JSON.parse(localStorage.getItem("user-id"));
    axios.get("/userTabs/" + storage.id + "/tab/" + tabID)
    .then((res) => {
      console.log(res);
      setGotInfo(res.data);
      setModal("tabInfo");
    })
  }

  const listInfo = (e, listID) => {
    axios.get("/tablist/" + selectedTab + "/list/" + listID)
    .then((res) => {
      console.log(res);
      setGotInfo(res.data);
      setModal("listInfo");
    })
  }

  const todoInfo = (e, listID, todoID) => {
    axios.get("/tablist/" + selectedTab + "/list/" + listID + "/todo/" + todoID)
    .then((res) => {
      console.log(res);
      setGotInfo(res.data);
      setTodoValues({listID : listID, todoID : todoID})
      setModal("todoInfo");
    })
  }

  const deleteTab = (e, tabID) => {
    e.preventDefault();
    let storage = JSON.parse(localStorage.getItem("user-id"));
    axios.delete("/userTabs/" + storage.id + "/tab/" + gotInfo["tab-id"])
    .then((res) => {
      let newTabs = [...tabs];
      for(let i = 0; i < newTabs.length; i++){
        if(newTabs[i]["tab-id"] === gotInfo["tab-id"]){
          newTabs.splice(i, 1);
        }
      }
      console.log(res);
      setTabs(newTabs);
      setModal("false");
      setGotInfo("");
    })
  }

  const deleteList = (e, listID) => {
    e.preventDefault();
    axios.delete("/tabList/" + selectedTab + "/list/" + gotInfo["list-id"])
    .then((res) => {
      let newLists = [...lists];
      for(let i = 0; i < newLists.length; i++){
        if(newLists[i]["list-id"] === gotInfo["list-id"]){
          newLists.splice(i, 1);
        }
      }
      console.log(res);
      setLists(newLists)
      setModal("false");
      setGotInfo("");
    })
  }

  const deleteTodo = (e, listID, todoID) => {
    e.preventDefault();

    console.log(todoValues.todoID);
    
    axios.delete("/tabList/" + selectedTab + "/list/" + todoValues.listID + "/todo/" + todoValues.todoID)
    .then((res) => {
      let newLists = [...lists];
      for(let i = 0; i < newLists.length; i++){

        if(newLists[i]["list-id"] === todoValues.listID){

          for(let j = 0; j < newLists[i]["list-todos"].length; j++){

            if(newLists[i]["list-todos"][j]["todo-id"] === todoValues.todoID){
              newLists[i]["list-todos"].splice(j, 1);
            }
          }
        }
      }
      console.log(res);
      setLists(newLists)
      setModal("false");
      setGotInfo("");
      setTodoValues({});
    })
  }

  const inputChangeList = (e) => {
    let values = {...newListValues};
    values[e.target.name] = e.target.value;
    setListValues(values);
  }

  const changeTodo = (e, newList) => {
    e.preventDefault();
    axios.put("/tabList/" + selectedTab + "/list/" + todoValues.listID + /todo/ + todoValues.todoID, JSON.stringify(newList), {
      headers : {
        "content-type" : "application/json"
      }
    })
    .then((res) => {
      console.log(res);
      let newLists = [...lists];
      for(let i = 0; i < newLists.length; i++){

        if(newLists[i]["list-id"] === todoValues.listID){

          for(let j = 0; j < newLists[i]["list-todos"].length; j++){
            
            if(newLists[i]["list-todos"][j]["todo-id"] === todoValues.todoID){

              if(newList.name){
                newLists[i]["list-todos"][j]["todo-name"] = newList.name;
              }
              if(newList.desc){
                newLists[i]["list-todos"][j]["todo-description"] = newList.desc;
              }
            }
          }
        }
      }
      console.log(res);
      setLists(newLists)
      setModal("false");
      setGotInfo("");
      setListValues({});
      setTodoValues({})
      setInfo({name : "", description : "", type : ""})
    })
  }

  const changeList = (e, newList) => {
    e.preventDefault();
    axios.put("/tabList/" + selectedTab + "/list/" + gotInfo["list-id"], JSON.stringify(newList), {
      headers : {
        "content-type" : "application/json"
      }
    })
    .then((res) => {
      console.log(res);
      let newLists = [...lists];
      for(let i = 0; i < newLists.length; i++){
        if(newLists[i]["list-id"] === gotInfo["list-id"]){
          if(newList.name){
            newLists[i]["list-name"] = newList.name;
          }
          if(newList.desc){
            newLists[i]["list-description"] = newList.desc;
          }
        }
      }
      console.log(res);
      setLists(newLists)
      setModal("false");
      setGotInfo("");
      setListValues({});
      setInfo({name : "", description : "", type : ""})
    })
  }

  const newTodo = (e, listId) => {
    setModal("newTodo");
    setSelectedList(listId);
  }

  const submitTodo = (e, info) => {
    e.preventDefault();
    console.log(info);
    axios.post("/tabList/" + selectedTab + "/list/" + selectedList + "/createTodo", JSON.stringify(info),{
      headers : {
        "content-type" : "application/json"
      }
    })
    .then((res) => {
      console.log(res);
      let newLists = [...lists];
      for(let i = 0; i < newLists.length; i++){
        if(newLists[i]["list-id"] === selectedList){
            newLists[i]["list-todos"].push(res.data);
        }
      }
      setLists(newLists);
      setModal("false");
      setInfo({name : "", description : "", type : ""})
    })
  }

  const cancelModal = (e) => {
    setListValues({});
    setModal("false");
    setGotInfo("");
    setInfo({name : "", description : "", type : ""})
    setSelectedList("");
  }

  const changeInfo = (e) => {
    let newInfo = {...sendInfo};
    newInfo[e.target.name] = e.target.value;
    setInfo(newInfo);
  }

  const submitInfo = (e) => {
    e.preventDefault(e);
    let storage = JSON.parse(localStorage.getItem("user-id"));
    axios.post(sendInfo.type, {"user-id" : storage.id, name : sendInfo.name, description : sendInfo.description})
    .then((res) => {
      console.log(res);
      setModal(false);
      let newTabs = [...tabs];
      newTabs.push(res.data)
      setTabs(newTabs);
      setInfo({name : "", description : "", type : ""})
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const submitList = (e) => {
    e.preventDefault(e);
    axios.post(sendInfo.type, {"tab-id" : selectedTab, name : sendInfo.name, description : sendInfo.description})
    .then((res) => {
      console.log(res);
      setModal(false);
      let newList = [...lists];
      newList.push(res.data)
      setLists(newList);
      setInfo({name : "", description : "", type : ""})
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const dropTodo = (e) => {
    e.preventDefault();

    console.log("succsesfull drop")
    
    const todo_id = e.dataTransfer.getData("todo_id");

    const todo = document.getElementById(todo_id);
    todo.style.display = "block";

    e.target.appendChild(todo);

    // /moveTodo/:id/todo/:todoID/from/:listIDFrom/to/:listIDTo
    if(moveInfo.fromID !== e.target.id){
      axios.put("/moveTodo/" + selectedTab + "/todo/" + moveInfo.todoID + "/from/" + moveInfo.fromID + "/to/" + e.target.id)
      .then((res) => {
        console.log(res);
      })
    }
  }
    
  

  const dragTodoOver = (e) => {
    e.preventDefault();
  }

  const dragStart = (e, listID) => {
    setDragging(true);
    const target = e.target;
    e.dataTransfer.setData("todo_id", target.id);

    target.className = "dragTodo";

    let newMoveInfo = {...moveInfo}
    newMoveInfo.todoID = target.id;
    newMoveInfo.fromID = listID;
    setMoveInfo(newMoveInfo);
    console.log(target.id);
    console.log(listID);

    setTimeout(() => {
      target.style.display = "none";
    }, 0);
  }

  const dragEnd = (e) => {
    setDragging(false);
    const target = e.target;

    target.className = "todo";

    e.dataTransfer.setData("todo_id", null);

    target.style.display = "block";
  }

  const dragOver = (e) => {
    e.stopPropagation();
  }

  console.log(moveInfo);
  console.log(isDragging);

  return(
    <Wrapper isDragging={isDragging} >
      {openModal !== "newTab" ? <div></div> : newtab(submitInfo, changeInfo, cancelModal, sendInfo)}

      {openModal !== "tabInfo" ? <div></div> : tabinfo(gotInfo, cancelModal, deleteTab, sendInfo)}

      {openModal !== "newList" ? <div></div> : newList(submitList, changeInfo, cancelModal, sendInfo)}

      {openModal !== "listInfo" ? <div></div> : listinfo(gotInfo, cancelModal, deleteList, changeList, inputChangeList, newListValues)}

      {openModal !== "newTodo" ? <div></div> : newtodo(submitTodo, changeInfo, cancelModal, sendInfo)}

      {openModal !== "todoInfo" ? <div></div> : todoinfo(gotInfo, cancelModal, deleteTodo, changeTodo, inputChangeList, newListValues)}

      <div className="tabs">
        {tabs.map((index, id) => {
          return(<div 
            className={selectedTab !== index["tab-id"] ? "tab" : "selectedTab"}
            onClick={selectedTab !== index["tab-id"] ? (e) => switchTab(e) : null}
            key={index["tab-id"]} 
            id={index["tab-id"]}
            >
              <h4 style={{pointerEvents : "none"}}>{index["tab-name"]}
                <span onClick={(e) => {tabInfo(e, index["tab-id"])}} className="material-icons">help_outline</span>
              </h4>
              </div>)
        })}
        <div className="newTab" onClick={(e) => newTab(e)}><span className="material-icons">add</span></div>
      </div>
      {lists.map((index, id) => {
        return(
          <div 
            className="list" 
            onDrop={(e) => dropTodo(e)}
            onDragOver={(e) => dragTodoOver(e)}
            key={index["list-id"]}
            id={index["list-id"]}
          >
            <div className="list-start"><h3 className="noselect">{index["list-name"]}</h3></div>
            <span onClick={(e) => {listInfo(e, index["list-id"])}} className="material-icons">create</span>
            {index["list-todos"].map((lindex, id) => {
              return(
                <div 
                  key={lindex["todo-id"]}
                  className="todo noselect"
                  draggable="true"
                  id={lindex["todo-id"]}
                  onDragStart={(e) => dragStart(e, index["list-id"])}
                  onDragOver={(e) => dragOver(e)}
                  onDragEnd={(e) => dragEnd(e)}
                  >{lindex["todo-name"]}
                    <span onClick={(e) => {todoInfo(e, index["list-id"], lindex["todo-id"])}} className="material-icons">create</span>
                  </div>
              )
            })}
            <div className="newTodo" onClick={(e) => newTodo(e, index["list-id"])}><span className="material-icons">add</span></div>
          </div>
        )
      })}
      {lists.length > 3 ? <div></div> : 
        <div className="newList" onClick={(e) => createList(e)}><span className="material-icons">add</span></div>
      }
    </Wrapper>
  )
}

export default TodosComp;
