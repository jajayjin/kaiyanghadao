import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './Login';
import Navbarformanager from './Navbarformanager';
import Staffpage from './Staffpage';
import Navbarforstaff from './Navbarforstaff';
import Stockformanager from './Stockformanager';
import Sellsummary from './Sellsummary';
import Moneysummary from './Moneysummary';
import Updatestockstaff from './Updatestockstaff';
import Sellsumnodate from './Sellsumnodate';
import Test2 from './Test2';
import Uploadtest from './Testupload';
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
  
                  <Login/>
          </Route>
          <Route path="/login" exact>
  
                  <Login/>
          </Route>
          <Route path="/manager">
                    <Navbarformanager/>
          </Route>
          <Route path="/test">
                    <Uploadtest/>
          </Route>
          <Route path="/staffproducts">
          <Navbarformanager/>
                    <Staffpage/>
          </Route>
          <Route path="/stock">
          <Navbarformanager/>
                    <Updatestockstaff/>
          </Route>
          <Route path="/test2">
          <Navbarformanager/>
                    <Test2/>
          </Route>
          <Route path="/managerstock">
          <Navbarformanager/>
                    <Stockformanager/>
          </Route>
          <Route path="/Sellsummary">
          <Navbarformanager/>
                    <Sellsummary/>
          </Route>
          {/* <Route path="/Sellsumnodate">
          <Navbarformanager/>
                    <Sellsumnodate/>
          </Route> */}
          <Route path="/Moneysummary">
          <Navbarformanager/>
                    <Moneysummary/>
          </Route>
          </Switch>
            </div>
          </div>
      </Router>
    );
  }
}
export default App;
