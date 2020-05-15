import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";

const Wrapper = styled.main`
  width: ${window.innerWidth * 0.8}px;
  height: ${window.innerHeight * 0.8}px;
  position: absolute;
  left: ${window.innerWidth * 0.1}px;
  top: ${window.innerHeight * 0.1}px;
  border: 1px solid gray;
  border-radius: 10px;
  display:flex;
  align-items: flex-start;

  .list{
    margin-left: 5px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 300px;
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
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }
`

function TodosComp(props){
  const [isDragging, setDragging] = useState(false);

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
  console.log(isDragging);

  return(
    <Wrapper isDragging={isDragging}>
      <div className="list"
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
    </Wrapper>
  )
}

export default TodosComp;