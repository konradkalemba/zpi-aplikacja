import React from 'react';
import logo from './logo.svg';
import Navbar from './components/Navbar/Navbar.js'
import './App.css';
import { Button } from 'react-bootstrap';
import MainView from "./components/MainView/index.js";

const App = () => {
  return (
    <div className="App">
      <Navbar/>
      <MainView/>
    </div>
  );
};

export default App;
