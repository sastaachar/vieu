import React, { useState, useRef } from "react";

import "./style.css";

const MovableCard = (props) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [grabbed, setGrab] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const cardDiv = useRef(null);

  const handleOnDown = (e) => {
    let x = cardDiv.current.offsetLeft - e.clientX,
      y = cardDiv.current.offsetTop - e.clientY;
    setOffset({ x, y });
    setGrab(true);
  };
  const handleMove = (e) => {
    let x = e.clientX + offset.x,
      y = e.clientY + offset.y;
    if (grabbed) setPos({ x, y });
  };

  return (
    <div
      className="movableCard noselect"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={handleOnDown}
      onMouseUp={() => setGrab(false)}
      onMouseLeave={() => setGrab(false)}
      onMouseMove={handleMove}
      ref={cardDiv}
    >
      {props.children}
    </div>
  );
};

export default MovableCard;
