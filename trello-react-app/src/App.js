import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import HeaderComp from "./components/HeaderComp";
import LoginComp from "./components/LoginComp";
import RegisterComp from "./components/RegisterComp";
import TodosComp from "./components/TodosComp";
import TabsComp from "./components/TabsComp";

function App() {
  return (
    <div className="App">
      <Router>
        <HeaderComp />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LoginComp} />
        <Route path="/register" component={RegisterComp} />
        <Route path="/todos" component={TodosComp} />
        <Route path="/tabs" component={TabsComp} />
        <div className="background"></div>
      </Router>
    </div>
  );
}

export default App;
