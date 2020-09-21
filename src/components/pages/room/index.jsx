import React from "react";

import SocketAdapter from "../../shared/adapters/socketAdapter";
import JoinRoom from "./joinRoom";

const RoomPage = (props) => {
  return (
    <>
      {
        // Adapter will take care of loading components
      }
      <SocketAdapter toJoinRoomId={props.match.params.room_id}>
        <JoinRoom />
      </SocketAdapter>
    </>
  );
};

export default RoomPage;
