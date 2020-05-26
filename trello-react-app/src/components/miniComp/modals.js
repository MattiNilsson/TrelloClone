import React from "react";

export const tabinfo = (gotInfo, cancelModal, deleteTab) => {
  return(
  <div className="modal">
    <div className="modalWrapper">
      <h1>{gotInfo["tab-name"]}</h1>
        <form className="modalForm">
          <label>description</label>
          <p>{gotInfo["tab-description"]}</p>
          <label>date</label>
          <p>{gotInfo["tab-date"]}</p>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>return</button>
            <button type="button" onClick={(e) => deleteTab(e)}>delete</button>
        </div>
      </form>
    </div>
  </div>
)}

export const newtab = (submitInfo, changeInfo, cancelModal) => {
  return(
    <div className="modal">
      <div className="modalWrapper">
        <h1>new tab</h1>
        <form className="modalForm" onSubmit={(e) => submitInfo(e)}>
          <label>name</label>
          <input onChange={(e) => changeInfo(e)} name="name" required/>
          <label>description</label>
          <textarea onChange={(e) => changeInfo(e)} name="description"></textarea>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>cancel</button>
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const newList = (submitInfo, changeInfo, cancelModal) => {
  return(
    <div className="modal">
      <div className="modalWrapper">
        <h1>new list</h1>
        <form className="modalForm" onSubmit={(e) => submitInfo(e)}>
          <label>name</label>
          <input onChange={(e) => changeInfo(e)} name="name" required/>
          <label>description</label>
          <textarea onChange={(e) => changeInfo(e)} name="description"></textarea>
          <div className="buttons">
            <button type="button" onClick={(e) => cancelModal(e)}>cancel</button>
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}