import React, { useRef, useEffect } from "react";

import MovableCard from "../../shared/movableCard";
import { connect } from "react-redux";

const UserCard = (props) => {
  const videoNode = useRef(null);

  useEffect(() => {
    videoNode.current.srcObject = props.peerStream;
  }, [props.peerStream]);

  return (
    <MovableCard>
      <div className="cardContainer">
        <span>{props.userName}</span>
        <button onClick={props.callUser}>send</button>
        <button
          onClick={() => {
            if (props.peer) {
              const senderList = [];
              props.stream.getTracks().forEach((track) => {
                senderList.push(props.peer.addTrack(track, props.stream));
              });
              props.senders[props.user_id] = senderList;
            }
          }}
        >
          sendVideo
        </button>
        <video playsInline autoPlay ref={videoNode} />
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(UserCard);
