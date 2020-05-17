import React from "react";
import styled from "styled-components";

const Wrapper = styled.main`
  width: ${window.innerWidth * 0.8}px;
  height: ${window.innerHeight * 0.8}px;
  position: absolute;
  left: ${window.innerWidth * 0.1}px;
  top: ${window.innerHeight * 0.1}px;
  border: 1px solid gray;
  border-radius: 10px;
  background-color: white;
  z-index: 2;
`

function TabsComp(props){
  return(
    <Wrapper>
      <h1>Welcome **NAME**</h1>
    </Wrapper>
  )
}

export default TabsComp;