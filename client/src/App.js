
import { Fragment } from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import './App.css';
import Login from './auth/Login';
import Register from './auth/Register';
import Landing from './components/layouts/Landing';
import Navbar from './components/layouts/Navbar';

const App = ()=> {
  return (
    <Fragment>
      <Router>
    <Navbar/>
    <Route exact path="/" component={Landing}/>
    <section className="container">
    <Switch>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
    </Switch>
    </section>
    </Router>
    </Fragment>
  );
}

export default App;
