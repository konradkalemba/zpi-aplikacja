import React from 'react';
import './App.css';
import Preferences from './components/Preferences'
import { Button } from 'react-bootstrap';
import MainView from "./components/MainView/index.js";
import Index from "./components/Navbar/index.js";

const App = () => {
  return (
    <div className="App">
        <Index/>
        <Preferences/>
        <MainView/>
      
    </div>
  );
};

export default App;
