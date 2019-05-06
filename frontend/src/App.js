import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import NavBar from './components/Navbar/Navbar'
import './App.scss';


class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <NavBar/>
                </div>
            </Router>
        );
    }
}

export default App;
