import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// functions
import { joinRoom } from "../../../../actions/roomActions";

// components
import RoomDisplay from "../roomDisplay";
import PeerAdapter from "../../../shared/adapters/peerAdapter";

import "./style.css";

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
    <div className="joinRoom-wrapper simple-layout">
      {loading ? <span>Finding your room....</span> : null}
      {exists ? (
        <div className="joinRoom-box">
          <h2>Join room</h2>
          <div>
            <section className="usernameInput">
              <span>who are you ?</span>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
              />
              <a onClick={handleJoinRoom} className="simple-btn">
                join room
              </a>
            </section>
            <section className="memberList">
              <span>Members :</span>
              <div>
                {Object.keys(members).length === 0 ? (
                  <span>Its so empty, sad.</span>
                ) : (
                  members.map(({ pseudoId, userName }) => (
                    <span key={pseudoId}>{userName}</span>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      ) : null}
      {!loading && !exists ? (
        <div className="noRoom-box">
          <span>No such room</span>
          <Link to="/">go back</Link>
        </div>
      ) : null}
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
