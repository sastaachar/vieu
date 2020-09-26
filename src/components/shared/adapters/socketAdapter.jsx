// this component will act as a interface for socket connection
import React from "react";

import { useEffect } from "react";
import { connect } from "react-redux";

// functions
import { connectToSocket } from "../../../actions/socketPeerActions";
import { checkRoom, joinRoom } from "../../../actions/roomActions";

const SocketAdapter = (props) => {
  // on mount -> connect to server
  // fetch room details

  useEffect(() => {
    props.connectToSocket((socket) => {
      props.checkRoom({ socket, room_id: props.toJoinRoomId });
    });
  }, []);

  // render children only after the socket gets connected

  return (
    <>
      {props.loading ? <span>Connecting to server.....</span> : null}
      {props.connected ? props.children : null}
    </>
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
