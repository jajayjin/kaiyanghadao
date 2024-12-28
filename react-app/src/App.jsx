import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './login';
import Navbarwithsearch from './Navbar';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
class App extends React.Component {
  render() {
    console.log(this.state)
    
    return (
      <Router>
        <div className="App">
        <div className="content">
          <Route path="/login">
                    <Navbarwithsearch/>
                    <Login/>
          </Route>
            </div>
          </div>
      </Router>
    );
  }
}
export default App;
