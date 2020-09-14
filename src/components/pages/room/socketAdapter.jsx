// this component will act as a interface for socket connection
import React from "react";

import { useEffect } from "react";
import { connect } from "react-redux";

// functions
import { connectToSocket } from "../../../actions/socketPeerActions";
import { checkRoom, joinRoom } from "../../../actions/roomActions";

// components
import JoinRoom from "./joinRoom";

const SocketAdapter = (props) => {
  // on mount -> connect to server
  // fetch room details

  useEffect(() => {
    props.connectToSocket((socket) => {
      console.log(props);
      props.checkRoom({ socket, room_id: props.toJoinRoomId });
    });
  }, []);

  return (
    <div className="close">
      {props.loading ? <span>Connecting to server.....</span> : null}
      {props.connected ? <JoinRoom /> : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.socketData.loading,
  connected: state.socketData.connected,
});

export default connect(mapStateToProps, {
  checkRoom,
  joinRoom,
  connectToSocket,
})(SocketAdapter);
