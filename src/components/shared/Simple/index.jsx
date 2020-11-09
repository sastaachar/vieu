import React from "react";

import "./SimpleStyle.css";

const SimpleBtn = (props) => {
  return (
    <button className="simpleBtn" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

const SimpleInp = (props) => {
  return <input className="simpleInp" {...props} />;
};

export { SimpleBtn, SimpleInp };
