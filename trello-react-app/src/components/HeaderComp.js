import React from "react";
import styled from "styled-components";

const Wrapper = styled.header`

  width : ${window.innerWidth}px;
  height : 50px;
  background-color: white;
  border-bottom: 1px solid gray;
  z-index: 2;
  h1{
    margin-top: 0;
  }
`

function HeaderComp(props){
  return(
    <Wrapper>
      <h1>JUST TO-DO IT!</h1>
    </Wrapper>
  )
}

export default HeaderComp;