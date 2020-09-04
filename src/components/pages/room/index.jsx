import React, { Component } from "react";
import { connect } from "react-redux";

import UseCard from "./userCard";
import SelfCard from "./selfCard";

// functions
import { connectToSocket } from "../../../actions/socketPeerActions";
import { checkRoom, joinRoom } from "../../../actions/roomActions";

// css
import "./room_page.css";
class RoomPage extends Component {
  state = {
    room_id: "",
    userName: "",
    myStream: null,
    otherStreams: {},
  };

  componentDidMount() {
    const room_id = this.props.match.params.room_id;
    this.setState({ room_id });
    this.props.connectToSocket((socket) => {
      this.props.checkRoom({ socket, room_id });
    });
  }

  handleJoinRoom = () => {
    const { socket } = this.props;
    const { userName, room_id } = this.state;

    if (!userName || !room_id) return;

    this.props.joinRoom({
      socket,
      data: { room_id, userName },
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setStream = (stream) => {
    this.setState({ myStream: stream });
  };

  render() {
    return (
      <div className="room-page-container">
        {this.props.socketConnected &&
        this.props.peerConnected &&
        this.props.exists &&
        !this.props.roomJoined ? (
          <div>
            <input type="text" name="userName" onChange={this.handleChange} />
            <button onClick={this.handleJoinRoom}>join room</button>
          </div>
        ) : null}
        {this.props.roomJoined
          ? this.props.members.map(({ user_id, userName }) => (
              <UseCard
                key={user_id}
                userName={userName}
                user_id={user_id}
                stream={this.state.myStream}
              />
            ))
          : null}
        {this.props.roomJoined ? (
          <SelfCard
            key={this.props.user_id}
            userName={this.state.userName}
            stream={this.state.myStream}
            setStream={this.setStream}
          />
        ) : null}

        <button onClick={this.handleCall}>call</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socketLoading: state.socketData.loading,
  peerLoading: state.peerData.loading,
  socketConnected: state.socketData.connected,
  peerConnected: state.peerData.connected,
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

  checkRoom,
  joinRoom,
})(RoomPage);
