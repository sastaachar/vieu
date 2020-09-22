import React, { useRef, useEffect } from "react";

import MovableCard from "../../../shared/movableCard";
import { connect } from "react-redux";

const UserCard = (props) => {
  const videoNode = useRef(null);

  useEffect(() => {
    console.log("Stream updated", props.peerStream);
    videoNode.current.srcObject = props.peerStream;
  }, [props.peerStream]);

  return (
    <MovableCard>
      <div className="cardContainer">
        {props.connected ? <span>connected dude</span> : null}

        <span>{props.userName}</span>
        <button
          onClick={() => {
            if (props.peer) {
              const senderList = [];
              props.myStream.getTracks().forEach((track) => {
                senderList.push(props.peer.addTrack(track, props.myStream));
              });
              props.senders[props.user_id] = senderList;
            }
          }}
        >
          sendVideo
        </button>
        <video playsInline autoPlay ref={videoNode} />
        <button
          onClick={() => {
            console.log(props.peerStream.getTracks());
          }}
        >
          click me
        </button>
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(UserCard);
