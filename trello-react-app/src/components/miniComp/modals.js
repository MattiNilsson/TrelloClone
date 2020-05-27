import React from "react";

export const tabinfo = (gotInfo, cancelModal, deleteTab) => {
  return(
  <div className="modal">
    <div className="modalWrapper">
      <h1>{gotInfo["tab-name"]}</h1>
        <form className="modalForm">
          <label style={{textDecoration : "underline"}}>description</label>
          <p>{gotInfo["tab-description"]}</p>
          <label style={{textDecoration : "underline"}}>date</label>
          <p>{gotInfo["tab-date"]}</p>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>return</button>
            <button type="button" onClick={(e) => deleteTab(e)}>delete</button>
        </div>
      </form>
    </div>
  </div>
)}

export const listinfo = (gotInfo, cancelModal, deleteTab, changeList, inputChangeList, listValues) => {
  return(
  <div className="modal">
    <div className="modalWrapper">
      <h1>{gotInfo["list-name"]}</h1>
        <form className="modalForm">
          <label style={{textDecoration : "underline"}}>description</label>
          <p>{gotInfo["list-description"]}</p>
          <label style={{textDecoration : "underline"}}>date</label>
          <p>{gotInfo["list-date"]}</p>
          
          <label>change name</label>
          <input name="name" value={listValues.name} onChange={(e) => {inputChangeList(e)}}/>
          <label>change description</label>
          <input name="desc" value={listValues.desc} onChange={(e) => {inputChangeList(e)}}/>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>return</button>
            <button type="button" onClick={(e) => deleteTab(e)}>delete</button>
            <button type="submit" onClick={(e) => changeList(e, listValues)}>change</button>
        </div>
      </form>
    </div>
  </div>
)}

export const todoinfo = (gotInfo, cancelModal, deleteTodo, changeTodo, inputChangeTodo, todoValues) => {
  return(
  <div className="modal">
    <div className="modalWrapper">
      <h1>todo : {gotInfo["todo-name"]}</h1>
        <form className="modalForm">
          <label style={{textDecoration : "underline"}}>description</label>
          <p>{gotInfo["todo-description"]}</p>
          <label style={{textDecoration : "underline"}}>date</label>
          <p>{gotInfo["todo-date"]}</p>
          
          <label>change name</label>
          <input name="name" value={todoValues.name} onChange={(e) => {inputChangeTodo(e)}}/>
          <label>change description</label>
          <input name="desc" value={todoValues.desc} onChange={(e) => {inputChangeTodo(e)}}/>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>return</button>
            <button type="button" onClick={(e) => deleteTodo(e)}>delete</button>
            <button type="submit" onClick={(e) => changeTodo(e, todoValues)}>change</button>
        </div>
      </form>
    </div>
  </div>
)}

export const newtab = (submitInfo, changeInfo, cancelModal, sendInfo) => {
  return(
    <div className="modal">
      <div className="modalWrapper">
        <h1>new tab</h1>
        <form className="modalForm" onSubmit={(e) => submitInfo(e)}>
          <label style={{textDecoration : "underline"}}>name</label>
          <input value={sendInfo.name} onChange={(e) => changeInfo(e)} name="name" required/>
          <label style={{textDecoration : "underline"}}>description</label>
          <textarea value={sendInfo.description} onChange={(e) => changeInfo(e)} name="description"></textarea>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>cancel</button>
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const newList = (submitInfo, changeInfo, cancelModal, sendInfo) => {
  return(
    <div className="modal">
      <div className="modalWrapper">
        <h1>new list</h1>
        <form className="modalForm" onSubmit={(e) => submitInfo(e)}>
          <label style={{textDecoration : "underline"}}>name</label>
          <input value={sendInfo.name} onChange={(e) => changeInfo(e)} name="name" required/>
          <label style={{textDecoration : "underline"}}>description</label>
          <textarea value={sendInfo.description} onChange={(e) => changeInfo(e)} name="description"></textarea>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>cancel</button>
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const newtodo = (submitInfo, changeInfo, cancelModal, sendInfo) => {
  return(
    <div className="modal">
      <div className="modalWrapper">
        <h1>new todo</h1>
        <form className="modalForm" onSubmit={(e) => submitInfo(e, sendInfo)}>
          <label style={{textDecoration : "underline"}}>name</label>
          <input value={sendInfo.name} onChange={(e) => changeInfo(e)} name="name" required/>
          <label style={{textDecoration : "underline"}}>description</label>
          <textarea value={sendInfo.description} onChange={(e) => changeInfo(e)} name="description"></textarea>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>cancel</button>
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}