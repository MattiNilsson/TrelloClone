import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from 'react-router-dom';

import {tabinfo, newtab, newList} from "./miniComp/modals";

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

  const [openModal, setModal] = useState(false);
  const [sendInfo, setInfo] = useState({name : "", description : "", type : ""})
  const [selectedTab, setSelectedTab] = useState("");

  const [gotInfo, setGotInfo] = useState("");

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

  const cancelModal = (e) => {
    setModal("false");
    setGotInfo("");
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
    
  }

  const dragTodoOver = (e) => {
    e.preventDefault();
  }

  const dragStart = (e) => {
    setDragging(true);
    const target = e.target;
    e.dataTransfer.setData("todo_id", target.id);

    target.className = "dragTodo";

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

  return(
    <Wrapper isDragging={isDragging} >
      {openModal !== "newTab" ? <div></div> : newtab(submitInfo, changeInfo, cancelModal)}

      {openModal !== "tabInfo" ? <div></div> : tabinfo(gotInfo, cancelModal, deleteTab)}

      {openModal !== "newList" ? <div></div> : newList(submitList, changeInfo, cancelModal)}

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
          >
            <div className="list-start"><h3 className="noselect">{index["list-name"]}</h3></div>
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

/*<div className="list"
      onDrop={(e) => dropTodo(e)}
      onDragOver={(e) => dragTodoOver(e)}
      >
        <div className="list-start"><h3 className="noselect">to do</h3></div>
        <div 
          className="todo noselect" 
          draggable="true"
          id="11"
          onDragStart={(e) => dragStart(e)}
          onDragOver={(e) => dragOver(e)}
          onDragEnd={(e) => dragEnd(e)}
          style={{order : 1}}
          >clean room</div>
        <div 
          className="todo noselect"
          draggable="true"
          id="12"
          onDragStart={(e) => dragStart(e)}
          onDragOver={(e) => dragOver(e)}
          onDragEnd={(e) => dragEnd(e)}
          style={{order : 2}}
          >meet friends</div>
        <div 
          className="todo noselect"
          draggable="true"
          id="12"
          onDragStart={(e) => dragStart(e)}
          onDragOver={(e) => dragOver(e)}
          onDragEnd={(e) => dragEnd(e)}
          style={{order : 2}}
          >meet friends</div>
      </div>
      <div className="list" 
        style={{order : 1}}
        onDrop={(e) => dropTodo(e)}
        onDragOver={(e) => dragTodoOver(e)}
      >
        <div className="list-start"><h3 className="noselect">doing</h3></div>
      </div>
      <div 
        className="list" 
        style={{order : 1}}
        onDrop={(e) => dropTodo(e)}
        onDragOver={(e) => dragTodoOver(e)}
      >
        <div className="list-start"><h3 className="noselect">done</h3></div>
      </div>
      <div 
        className="list" 
        style={{order : 1}}
        onDrop={(e) => dropTodo(e)}
        onDragOver={(e) => dragTodoOver(e)}
      >
      <div className="list-start"><h3 className="noselect">done</h3></div>
      </div>
*/