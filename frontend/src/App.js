import React from 'react';
import './App.css';
import Preferences from './components/Preferences'
import { Button } from 'react-bootstrap';
import MainView from "./components/MainView/index.js";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="App">
        <Navbar/>
        <Preferences/>
        <MainView/>
    </div>
  );
};

export default App;
