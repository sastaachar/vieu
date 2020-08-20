import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./App.css";

import store from "./store";
import MainPage from "./components/pages/main";
import RoomPage from "./components/pages/room";
import NotFoundPage from "./components/pages/notFound";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/room/:room_id">
            <RoomPage />
          </Route>
          <Route path="/404">
            <NotFoundPage />
          </Route>
          <Redirect to="/404" />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
