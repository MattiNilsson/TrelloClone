import React, {useState} from "react";
import styled from "styled-components";
import { Redirect } from 'react-router-dom';
import axios from "axios";

const Wrapper = styled.main`
position: relative;
top: 50px;
display:flex;
align-items : center;
flex-direction: column;
form{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  border: 1px solid gray;
  border-radius: 10px;
  background-color: white;
}
form:hover{
  border: 1px solid rgb(41, 133, 185);
}
label{
  margin-top: 10px;
  width: 200px;
}
button{
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100px;
  border: 1px solid gray;
  background-color: white;
  border-radius: 20px;
  outline: none;
}
button:hover{
  border: 1px solid rgb(41, 133, 185);
  color: rgb(41, 133, 185);
  background-color: rgba(41, 133, 185, 0.1);
}
input{
  padding-left: 20px;
  width: 180px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid gray;
  outline: none;
}
input:hover{
  border: 1px solid rgb(41, 133, 185);
  background-color: rgba(41, 133, 185, 0.1);
}
input:focus{
  border: 1px solid rgb(41, 133, 185);
}

.reg{
  position: relative;
  top: ${(window.innerHeight / 2) - 160}px;
}
.reg > p{
margin-bottom: 0;
}
.err{
  color: red;
}
`

function RegisterComp(props){
  const [redirect, setRedirect] = useState(null);
  const [data, setData] = useState({username : "", pass : "", repass : ""});
  const [err, setErr] = useState("");

  function onRedirect(){
    console.log("hello");
    setRedirect(true);
  }
  if(redirect){
    return(<Redirect to={"/login"} />);
  }

  const createUser = (e) => {
    e.preventDefault();
    if(data.pass !== data.repass){
      console.error("passwords dont match!");
      setErr("passwords do not match!");
      return;
    }
    if(data.username === "" || data.pass === "" || data.repass === ""){
      console.error("please choose a username and password!");
      setErr("please choose a username and password!");
      return;
    }
    axios.post("/createUser", JSON.stringify({username : data.username, password : data.pass}), {
      headers : {
        "content-type" : "application/json"
      }
    })
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
      setErr(error.statusText);
    })
  }

  const dataChange = (e) => {
    let newData = {...data};
    newData[e.target.name] = e.target.value;
    setData(newData);
  }

  return(
    <Wrapper>
      <h1>Register</h1>
      <form onSubmit={(e) => createUser(e)}>
        <label className="err">{err}</label>
        <label>username</label>
        <input onChange={(e) => {dataChange(e)}} name="username" value={data.username} required/>
        <label>password</label>
        <input type="password" onChange={(e) => {dataChange(e)}} name="pass" value={data.pass} required/>
        <label>re-password</label>
        <input type="password" onChange={(e) => {dataChange(e)}} name="repass" value={data.repass} required/>
        <button type="submit">Register</button>
      </form>
      <div className="reg">
        <p>already have an account? go here!</p>
        <button onClick={() => onRedirect()}>Log in</button> 
      </div>
    </Wrapper>
  )
}

export default RegisterComp;