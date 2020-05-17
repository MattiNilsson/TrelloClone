import React, {useState} from "react";
import styled from "styled-components";
import { Redirect } from 'react-router-dom';

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
  background-color: rgba(41, 133, 185, 0.1);
  color: rgb(41, 133, 185);
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
  top: ${(window.innerHeight / 2) - 100}px;
}
.reg > p{
margin-bottom: 0;
}
`

function LoginComp(props){
  const [redirect, setRedirect] = useState(null);

  function onRedirect(){
    console.log("hello");
    setRedirect(true);
  }
  if(redirect){
    return(<Redirect to={"/register"} />);
  }

  return(
    <Wrapper>
      <h1>Login</h1>
      <form>
        <label>username</label>
        <input name="username"/>
        <label>password</label>
        <input type="password" name="password"/>
        <button type="submit">Log in</button>
      </form>
      <div className="reg">
        <p>not registered? go here!</p>
        <button onClick={() => onRedirect()}>Register</button>
      </div>
    </Wrapper>
  )
}

export default LoginComp;