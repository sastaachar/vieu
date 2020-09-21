import React, { useState } from "react";
import { connect } from "react-redux";

// functions
import { joinRoom } from "../../../../actions/roomActions";

// components
import RoomDisplay from "../roomDisplay";
import PeerAdapter from "../../../shared/adapters/peerAdapter";

const JoinRoom = (props) => {
  const { exists, loading, room_id, members } = props;

  const [userName, setUsername] = useState("");

  const handleJoinRoom = () => {
    props.joinRoom(
      { socket: props.socket, data: { room_id, userName } },
      () => {
        console.log("Room joined succefully");
      }
    );
  };

  if (props.roomJoined) {
    return (
      <PeerAdapter>
        <RoomDisplay />
      </PeerAdapter>
    );
  }

  return (
    <div>
      {exists ? (
        <div>
          <span>{`Room id : ${room_id}`}</span>
          {members.map(({ pseudoId, userName }) => (
            <span key={pseudoId}>{userName} </span>
          ))}
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
          <button onClick={handleJoinRoom}>join room</button>
        </div>
      ) : null}
      {!loading && !exists ? <span>No room</span> : null}
      {loading ? <span>Finding your room....</span> : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  exists: state.roomData.exists,
  loading: state.roomData.loadingCheckRoom,
  room_id: state.roomData.room_id,
  members: state.roomData.chkMembers,
  socket: state.socketData.socket,
  roomJoined: state.roomData.roomJoined,
});

export default connect(mapStateToProps, { joinRoom })(JoinRoom);
