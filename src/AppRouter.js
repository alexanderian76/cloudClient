import React, { useContext, useEffect } from "react";
import {Routes, Route, useLocation} from 'react-router-dom'
import Auth from "./pages/Auth";
import { authRoutes, publicRoutes } from "./routes";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

function AppRouterComp() {
  
  const {user} = useContext(Context)
  console.log(user)
 // const isAuth = true;
  return (
    <Routes>
        {user.Auth && authRoutes.map(({route, Element}) => {
            return <Route key={route} path={route} element={<Element />}/>
        })}
        {publicRoutes.map(({route, Element}) => {
            return <Route key={route} path={route} element={<Element/>}/>
        })}
        <Route path="*" element={<Auth/>}/>
    </Routes>
  );
}
const AppRouter = observer(AppRouterComp)
export default AppRouter;
