import React, { Component } from "react";
import { connect } from "react-redux";

import {
  connectToSocket,
  connectToPeer,
} from "../../../actions/socketPeerActions";
import { checkRoom, joinRoom } from "../../../actions/roomActions";

class RoomPage extends Component {
  state = {
    room_id: "",
    userName: "",
  };

  componentDidMount() {
    const room_id = this.props.match.params.room_id;
    this.setState({ room_id });
    this.props.connectToPeer((user_id) => {
      this.props.connectToSocket((socket) => {
        this.props.checkRoom({ socket, room_id });
      });
    });
  }

  handleJoinRoom = () => {
    const { socket, user_id } = this.props;
    const { userName, room_id } = this.state;

    if (!userName || !room_id) return;

    this.props.joinRoom({
      socket,
      data: { room_id, user_id, userName },
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="room-page-container">
        {this.props.socketConnected &&
        this.props.peerConnected &&
        this.props.exists ? (
          <div>
            <input type="text" name="userName" onChange={this.handleChange} />
            <button onClick={this.handleJoinRoom}>join room</button>
          </div>
        ) : null}
        {this.props.roomJoined ? (
          <div>
            {this.props.members.map(({ user_id, userName }) => (
              <span key={user_id}>{userName}</span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socketLoading: state.socketData.loading,
  peerLoading: state.peerData.loading,
  socketConnected: state.socketData.connected,
  peerConnected: state.peerData.connected,
  user_id: state.peerData.peerId,
  socket: state.socketData.socket,
  loadingGetRoom: state.roomData.loadingGetRoom,
  loadingCheckRoom: state.roomData.loadingCheckRoom,
  loadingJoinRoom: state.roomData.loadingJoinRoom,
  roomJoined: state.roomData.roomJoined,
  members: state.roomData.members,
  exists: state.roomData.exists,
});

export default connect(mapStateToProps, {
  connectToSocket,
  connectToPeer,
  checkRoom,
  joinRoom,
})(RoomPage);
