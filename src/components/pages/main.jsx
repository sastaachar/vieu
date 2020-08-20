import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

const MainPage = (props) => {
  const [room_id, setRoomid] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to={`/room/${room_id}`} />;
  }

  return (
    <div className="mainPage-container">
      <span>main</span>
      <input
        type="text"
        onChange={(e) => {
          setRoomid(e.target.value);
        }}
      />
      <button
        onClick={(e) => {
          setRedirect(true);
        }}
      >
        go
      </button>
    </div>
  );
};

export default MainPage;
