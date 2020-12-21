import React from "react";
import { connect } from "react-redux";

import SocketAdapter from "../../shared/adapters/socketAdapter";
import PeerAdapter from "../../shared/adapters/peerAdapter";

import JoinRoom from "./joinRoom";
import ChatRoom from "./chatRoom";

const Room = (props) => {
  const { roomJoined } = props;
  return (
    <SocketAdapter toJoinRoomId={props.match.params.room_id}>
      {roomJoined ? (
        <PeerAdapter>
          <ChatRoom />
        </PeerAdapter>
      ) : (
        <JoinRoom />
      )}
    </SocketAdapter>
  );
};

const mapStateToProps = (state) => ({
  roomJoined: state.roomData.roomJoined,
});

export default connect(mapStateToProps, null)(Room);
