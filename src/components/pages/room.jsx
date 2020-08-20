import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

const RoomPage = () => {
  const [user_id, setUserid] = useState("");
  let { room_id } = useParams();
  console.log("RoomPage -> id", room_id);

  useEffect(() => {
    // check if room_id exists
    // connect to room
    // if it does create a peer
    // return closing from room and close peer
  }, [room_id]);

  return (
    <div className="main-page-container">
      <span>{`Welcome to ${room_id}`}</span>
    </div>
  );
};

export default RoomPage;
