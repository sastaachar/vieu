import { useEffect } from "react";
import { connect } from "react-redux";

// functions
import { connectToSocket } from "../../../actions/socketPeerActions";
import { checkRoom, joinRoom } from "../../../actions/roomActions";

const SocketAdapter = () => {
  // on mount -> connect to server
  // fetch room details
  useEffect(() => {
    props.connectToSocket((socket) => {
      props.checkRoom({ socket, room_id });
    });
  });

  return (
    <div className="close">
      <span></span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.socketData.loading,
});

export default connect(mapStateToProps, {
  checkRoom,
  joinRoom,
  connectToSocket,
})(SocketAdapter);
