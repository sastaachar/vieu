import React, { useRef, useEffect } from "react";

import MovableCard from "../../../shared/movableCard";
import { connect } from "react-redux";

import "./style.css";

const UserCard = (props) => {
  const videoNode = useRef(null);

  useEffect(() => {
    videoNode.current.srcObject = props.peerStream;
  }, [props.peerStream]);

  useEffect(() => {
    console.log(props.user_id, "Sending4");
    if (props.connected) {
      console.log(props.user_id, "Sending3");
      if (!props.senders[props.user_id] && props.myStream) {
        console.log(props.user_id, "Sending2");
        if (props.streamState.audio || props.streamState.video) {
          console.log(props.user_id, "Sending");
          const sendersList = [];
          props.myStream.getTracks().forEach((track) => {
            sendersList.push(props.peer.addTrack(track, props.myStream));
          });
          props.senders[props.user_id] = sendersList;
        }
      }
    }
  }, [props.streamState.audio, props.streamState.video, props.connected]);

  return (
    <MovableCard>
      <div className="cardContainer">
        <span>{props.userName}</span>
        <video
          className="videoMirror"
          playsInline
          autoPlay
          controls
          ref={videoNode}
        />
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({
  streamState: state.streamData,
});

export default connect(mapStateToProps, null)(UserCard);
