import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

import store from "./store";
import MainPage from "./components/pages/main";
import RoomPage from "./components/pages/room";
import NotFoundPage from "./components/pages/notFound";

function App() {
  useEffect(() => {
    //redirect to https
    const url = window.location.origin;
    if (!url.includes("localhost") && !url.includes("https")) {
      window.location = `https:${url.split(":")[1]}`;
    }
  }, []);
  return (
    <Provider store={store}>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/room/:room_id" component={RoomPage} />
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </Provider>
  );
}

export default App;
