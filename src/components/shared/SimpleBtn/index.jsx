import React from "react";

import "./style.css";

const SimpleBtn = (props) => {
  return (
    <button className="simpleBtn" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default SimpleBtn;
