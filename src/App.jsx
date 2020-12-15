import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

import store from "./store";
import MainPage from "./components/pages/main";
import RoomPage from "./components/pages/room";
import NotFoundPage from "./components/pages/notFound";

function App() {
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
