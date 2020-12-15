import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { HashRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router basename={""}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
