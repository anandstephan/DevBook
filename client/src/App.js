
import { Fragment,useEffect } from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing from './components/layouts/Landing';
import Navbar from './components/layouts/Navbar';

//Redux
import {Provider} from 'react-redux'
import store from './store'
import Alert from './components/layouts/Alert';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = ()=> {
 useEffect(() => {
  store.dispatch(loadUser())
 }, [])
  return (
    <Provider store={store}>
    <Fragment>
      <Router>
    <Navbar/>
    <Route exact path="/" component={Landing}/>
    <section className="container">
      <Alert/>
    <Switch>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
    </Switch>
    </section>
    </Router>
    </Fragment>
    </Provider>
  );
}

export default App;
