import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";

import MovableCard from "../../../shared/movableCard";

import "./style.css";

const UserCard = (props) => {
  const userVideoNode = useRef(null);
  const userAudioNode = useRef(null);
  const screenVideoNode = useRef(null);

  const {
    userID,
    streams: { userVideo, userAudio, screenVideo },
  } = props;

  useEffect(() => {
    if (userVideo) {
      userVideoNode.current.srcObject = userVideo;
    }
  }, [userVideo, userID]);

  useEffect(() => {
    if (userAudio) {
      console.log("user audio changed for ", userID);

      userAudioNode.current.srcObject = userAudio;
    }
  }, [userAudio, userID]);

  useEffect(() => {
    if (screenVideo) {
      screenVideoNode.current.srcObject = screenVideo;
    }
  }, [screenVideo, userID]);

  return (
    <MovableCard>
      <div className="cardContainer">
        <span>{props.userName}</span>
        {userVideo && (
          <video
            className="user-video"
            playsInline
            autoPlay
            controls
            ref={userVideoNode}
          />
        )}
        {userAudio && (
          <audio autoPlay className="user-audio" ref={userAudioNode}></audio>
        )}
        {screenVideo && (
          <video
            className="screen-video"
            ref={screenVideoNode}
            playsInline
            autoPlay
            controls
          ></video>
        )}
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(UserCard);
