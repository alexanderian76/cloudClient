import logo from './logo.svg';
import './App.css';
import { observer } from "mobx-react-lite";
import {BrowserRouter, useNavigate} from 'react-router-dom'
import React, { useContext, useEffect, useState } from "react";
import { check } from "./http/userAPI";
import { Context } from "./index";
import AppRouter from "./AppRouter";

function AppComp() {

  const {user, directory} = useContext(Context)

  useEffect(() => {
    
    async function fetchCheck() {
      
      let data = await check()
      
      console.log('check')
      console.log(data)
      user.setUser(data)
      user.setIsAuth(true)
       // directory.setDir(directory.Dir == '' ? '/uploads/' : directory.Dir)
  }
  fetchCheck()
}
    , [])

  return (
    <BrowserRouter>
      
      <AppRouter/>
    </BrowserRouter>
  );
}

const App = observer(AppComp)

export default App;
