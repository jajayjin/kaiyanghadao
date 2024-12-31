import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './login';
import Navbarformanager from './Navbarformanager';
import Staffpage from './Staffpage';
import Navbarforstaff from './Navbarforstaff';
import Stockformanager from './Stockformanager';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
class App extends React.Component {
  render() {
    console.log(this.state)
    
    return (
      <Router>
        <div className="App">
        <div className="content">
        <Switch> 
          <Route path="/" exact>
          <Navbarformanager/>
                  <Login/>
          </Route>
          <Route path="/manager">
                    <Navbarformanager/>
          </Route>
          <Route path="/staff">
          <Navbarforstaff/>
                    <Staffpage/>
          </Route>
          <Route path="/managerstock">
          <Navbarforstaff/>
                    <Stockformanager/>
          </Route>
          </Switch>
            </div>
          </div>
      </Router>
    );
  }
}
export default App;
