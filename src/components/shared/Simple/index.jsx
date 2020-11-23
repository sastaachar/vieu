import React from "react";

import "./SimpleStyle.css";

const SimpleBtn = (props) => {
  return (
    <button className="simple-btn" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

const SimpleInp = (props) => {
  return <input className="simple-inp" {...props} />;
};

export { SimpleBtn, SimpleInp };
