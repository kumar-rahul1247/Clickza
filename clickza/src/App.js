import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'

import Header from './Component/Header/Header';
import Login from './Component/Login/Login';
import Signup from './Component/Signup/Signup';
import Profile from './Component/Profile/Profile';
import Create from './Component/Create/Create';
import Home from './Component/Home/Home';
import SubscribePost from './Component/SubscribePost/SubscribePost';
import UserProfile from './Component/UserProfile/UserProfile';
import {userReducer, initialState} from './reducer/userReducer';
import ResetPassword from "./Component/Signup/ResetPassword";
import NewPassword from './Component/Signup/NewPassword';

import {UserProvider} from './Context/UserContext'

const Routing = ({setUser}) => {

  const history = useHistory();

  useEffect(()  => {
    const user = JSON.parse(localStorage.getItem("user"))
       
      if(user){
        setUser(user)
        
      }
      else{
        if(!history.location.pathname.startsWith('/reset'))
          history.push('/signin');
      }

      
    
  },[])
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/create" component={Create} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/subspost" component={SubscribePost} />
      <Route exact path= "/reset" component={ResetPassword} />
      <Route path="/reset/:token" component={NewPassword} />
    </Switch>
  )
}

function App() {
  const [ state, dispatch ] = useReducer(userReducer, initialState);
  const [ user, setUser] = useState(null);
  return (
    <UserProvider value={{user: user, setUser: setUser}}>   
      <BrowserRouter>
        <Header />
        <Routing setUser={setUser}/>
      </BrowserRouter>
    </UserProvider>
    
  );
}

export default App;
