import React, { useContext, useState } from "react";
import { Card, Container, Form, FormControl, Button, Nav } from "react-bootstrap";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { REGISTRATION_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, ADMIN_ROUTE } from "../utils/consts";
import {login, registration} from '../http/userAPI'
import { observer } from "mobx-react-lite";
import { Context } from "../index";

function AuthComp() {
  const {user} = useContext(Context)
  const location = useLocation()
  const isLogin = location.pathname === LOGIN_ROUTE
 // console.log(location)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const signClick = async () => {
    try {
      let data;
      if(isLogin) {
        data = await login(email, password)
      }
      else {
        data = await registration(email, password)
        console.log(data)
      }
      console.log(data)
      user.setUser(data)
      user.setIsAuth(true)
      navigate(ADMIN_ROUTE)
  } catch(e) {
    
    alert(e.response.data.message)
  }
  }
  return (
    <Container className="d-flex justify-content-center align-items-center"
    style={{height: window.innerHeight - 54}}
    >
    <Card style={{width: 600}} className="p-5">
      <h2 className="m-auto">{isLogin ? "Вход" : 'Регистрация'}</h2>
      <Form className="d-flex flex-column">
        <FormControl placeholder="Введите имя репозитория" className="mt-3" value={email} onChange={e => setEmail(e.target.value)}/>
        <FormControl placeholder="Введите пароль" className="mt-3" value={password} onChange={e => setPassword(e.target.value)} type='password'/>
        {isLogin ?
        <><div>
          Нет репозитория? <NavLink to={REGISTRATION_ROUTE}>Регистрация</NavLink>
        </div>
        <Button className="mt-3 align-self-end" variant={"outline-success"} onClick={signClick}>Войти</Button></>
        :
        <><div>
          Уже есть репозиторий? <NavLink to={LOGIN_ROUTE}>Войти</NavLink>
        </div>
        <Button className="mt-3 align-self-end" variant={"outline-success"} onClick={signClick}>Регистрация</Button></>
}
        
      </Form>
    </Card>
    </Container>
  );
}
const Auth = observer(AuthComp);
export default Auth;