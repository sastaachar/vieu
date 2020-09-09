import React, { useRef, useEffect } from "react";

import MovableCard from "../../shared/movableCard";
import { connect } from "react-redux";
import { useState } from "react";

const UserCard = (props) => {
  const videoNode = useRef(null);
  const [currentStream, setStream] = useState(null);
  useEffect(() => {
    if (!videoNode.current) return;
    console.log("Setting track", props.userStream);
    videoNode.current.srcObject = props.userStream;
  }, [props.userStream]);

  return (
    <MovableCard>
      <div className="cardContainer">
        {props.channel ? (
          <button onClick={props.sendVideo}>sendvideo</button>
        ) : null}
        <span>{props.userName}</span>
        <button onClick={props.callUser}>send</button>
        <video playsInline autoPlay ref={videoNode} controls />
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(UserCard);
