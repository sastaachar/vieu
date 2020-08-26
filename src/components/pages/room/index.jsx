import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import {
  connectToSocket,
  connectToPeer,
} from "../../../actions/socketPeerActions";

const RoomPage = (props) => {
  // const [user_id, setUserid] = useState("");
  let { room_id } = useParams();
  const {
    socketLoading,
    peerLoading,
    socketConnected,
    peerConnected,
    connectToPeer,
    connectToSocket,
    socket,
  } = props;
  useEffect(() => {
    if (peerLoading || socketLoading) return;

    if (!socketConnected) {
      // Connecting both socket and peer
      console.log("RoomPage -> Connecting both socket and peer");
      connectToSocket((socket) => {
        if (!peerConnected) {
          connectToPeer((user_id) => {
            socket.emit("JOIN_ROOM", { user_id, room_id }, (joined, error) => {
              if (error) console.log(error);
              console.log("Joined room |", joined, "|");
            });
          });
        }
      });
    } else {
      if (!peerConnected) {
        // Socket already connected so only connecting peer
        console.log(
          "RoomPage -> Socket already connected so only connecting peer"
        );
        connectToPeer((user_id) => {
          socket.emit("JOIN_ROOM", { user_id, room_id });
        });
      }
    }
  }, [
    room_id,
    connectToPeer,
    connectToSocket,
    peerConnected,
    socketConnected,
    socketLoading,
    socket,
    peerLoading,
  ]);

  return (
    <div className="main-page-container">
      {socketLoading ? <span>Socket Loding...</span> : null}
      {peerLoading ? <span>Peer Loding...</span> : null}
      {socketConnected ? <span>Socket Connected...</span> : null}
      {peerConnected ? <span>Peer Connected...</span> : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  socketLoading: state.socketData.loading,
  peerLoading: state.peerData.loading,
  socketConnected: state.socketData.connected,
  peerConnected: state.peerData.connected,
  socket: state.socketData.socket,
});

export default connect(mapStateToProps, { connectToSocket, connectToPeer })(
  RoomPage
);
