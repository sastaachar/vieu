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
            props.stream.getTracks().forEach((track) => {
              if (props.peer) props.peer.addTrack(track, props.stream);
            });
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
