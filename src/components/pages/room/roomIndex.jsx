import React from "react";

import SocketAdapter from "./socketAdapter";

const RoomPage = (props) => {
  return (
    <>
      <SocketAdapter toJoinRoomId={props.match.params.room_id} />
    </>
  );
};

export default RoomPage;
