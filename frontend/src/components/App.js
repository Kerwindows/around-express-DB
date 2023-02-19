import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import Landingpage from "./Landingpage";
import * as auth from "../utils/auth.js";
import "../index.css";

function App() {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [regStatus, setRegStatus] = useState(true);

  function handleEmail(authStatus) {
    setUserEmail(authStatus);
  }

  function handleInfoTooltip(authStatus) {
    setInfoTooltipOpen(authStatus);
  }
  function closeInfoPopup() {
    setInfoTooltipOpen(false);
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.data.email);
            history.push("/");
          }
        })
        .catch((err) => console.log(`{'Something went wrong'}`));
    }
  }, []);

  function loginRequest(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          handleLogin();
          handleEmail(email);
          history.push("/");
        }
      })
      .catch((err) => {
        setRegStatus(false);
        handleInfoTooltip(true);
        console.log(err);
      });
  }

  function registerRequest(password, email) {
    auth
      .register(password, email)
      .then((res) => {
        setRegStatus(true);
        handleInfoTooltip(true);
        history.push("/");
      })
      .catch((err) => {
        setRegStatus(false);
        handleInfoTooltip(true);
        console.log(err);
      });
  }

  return (
    <>
      <Header
        userEmail={userEmail}
        loggedIn={loggedIn}
        handleLogout={handleLogout}
        setUserEmail={setUserEmail}
      />
      <Switch>
        <Route path='/signin'>
          <Login loginRequest={loginRequest} />
        </Route>
        <Route path='/signup'>
          <Register registerRequest={registerRequest} />
        </Route>
        <ProtectedRoute path='/' loggedIn={loggedIn} component={Landingpage} />
        <Route exact path='/'>
          {loggedIn ? <Redirect to='/' /> : <Redirect to='/signin' />}
        </Route>
      </Switch>
      <InfoTooltip
        regStatus={regStatus}
        isOpen={isInfoTooltipOpen}
        onClose={closeInfoPopup}
      />
    </>
  );
}

export default App;
