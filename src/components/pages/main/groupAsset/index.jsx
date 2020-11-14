import React, { useState, useEffect } from "react";

import Big from "./groupSvgBig";
import Small from "./groupSvgSmall";

import "./style.css";

const Group = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    console.log("called");
    const handler = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return <>{width > 1000 ? <Big /> : <Small />}</>;
};

export default Group;
