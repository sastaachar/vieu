import React, { useState } from "react";

import { connect } from "react-redux";

// components
import UseCard from "../cards/userCard";
import SelfCard from "../cards/selfCard";

// csss
import "./style.css";

const RoomDisplay = (props) => {
  const [myStream, setMyStream] = useState();
  console.log("Connection status", props.connStatus);
  return (
    <div>
      {props.members.map(({ user_id, userName }) => (
        <UseCard
          key={user_id}
          user_id={user_id}
          userName={userName}
          peer={props.peers[user_id]}
          myStream={myStream}
          peerStream={props.streams[user_id]}
          senders={props.senders}
          connected={props.connStatus[user_id]}
        />
      ))}
      <SelfCard
        key={props.my_id}
        userName={props.userName}
        setMyStream={setMyStream}
        senders={props.senders}
        stream={myStream}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  members: state.roomData.members,
  my_id: state.roomData.myData.user_id,
  userName: state.roomData.myData.userName,
});
export default connect(mapStateToProps, null)(RoomDisplay);
