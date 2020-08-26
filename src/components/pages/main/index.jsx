import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { connectToSocket } from "../../../actions/socketPeerActions";

const MainPage = (props) => {
  const [room_id, setRoomid] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { socketLoading, socketConnected, connectToSocket } = props;

  const handleCreateRoom = (e) => {
    // connect to socket
    // create and join room
    // redirect
    console.log("caleld");
    if (!socketLoading && !socketConnected) {
      connectToSocket((socket) => {
        socket.emit("CREATE_ROOM", {}, (room_id, error) => {
          if (error) {
            alert(error.message);
            return;
          }
          console.log("Room created", room_id);
          setRoomid(room_id);
          setRedirect(true);
        });
      });
    }
  };

  if (redirect) {
    return <Redirect to={`/room/${room_id}`} />;
  }

  return (
    <div className="mainPage-container">
      <label htmlFor="room_id">Enter Room id</label>
      <input
        id="room_id"
        type="text"
        onChange={(e) => setRoomid(e.target.value)}
      />
      <button onClick={() => setRedirect(true)}> Go </button>

      <button onClick={handleCreateRoom}> Create room </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  socketLoading: state.socketData.loading,
  socketConnected: state.socketData.connected,
});

export default connect(mapStateToProps, { connectToSocket })(MainPage);
