import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";

import MovableCard from "../../../shared/movableCard";

// assets
import Avatar1 from "../../../../assets/Avatars/Avatar1.svg";
import Avatar2 from "../../../../assets/Avatars/Avatar2.svg";
import Avatar3 from "../../../../assets/Avatars/Avatar3.svg";
import Avatar4 from "../../../../assets/Avatars/Avatar4.svg";
import Avatar5 from "../../../../assets/Avatars/Avatar5.svg";
import Avatar6 from "../../../../assets/Avatars/Avatar6.svg";
import Avatar7 from "../../../../assets/Avatars/Avatar7.svg";
import Avatar8 from "../../../../assets/Avatars/Avatar8.svg";

import "./style.css";

const UserCard = (props) => {
  const userVideoNode = useRef(null);
  const userAudioNode = useRef(null);
  const screenVideoNode = useRef(null);

  const avatars = [
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
    Avatar8,
  ];

  const {
    user_id,
    streams: { userVideo, userAudio, screenVideo },
  } = props;

  useEffect(() => {
    if (userVideo) {
      console.log("user user video changed for ", user_id);
      userVideoNode.current.srcObject = userVideo;
    }
  }, [userVideo, user_id]);

  useEffect(() => {
    if (userAudio) {
      console.log("user audio changed for ", user_id);

      userAudioNode.current.srcObject = userAudio;
    }
  }, [userAudio, user_id]);

  useEffect(() => {
    if (screenVideo) {
      console.log("user screen changed for ", user_id);
      screenVideoNode.current.srcObject = screenVideo;
    }
  }, [screenVideo, user_id]);

  return (
    <MovableCard>
      <div className="cardContainer">
        <span className="cardUserName">{props.userName}</span>
        {userVideo && (
          <div className="card-user-video">
            <video
              className="card-user-video"
              playsInline
              autoPlay
              controls
              ref={userVideoNode}
            />
          </div>
        )}
        {userAudio && (
          <audio
            autoPlay
            className="card-user-audio"
            ref={userAudioNode}
          ></audio>
        )}
        {screenVideo && (
          <video
            className="card-screen-video"
            ref={screenVideoNode}
            playsInline
            autoPlay
            controls
          ></video>
        )}
        {!screenVideo && !userVideo && (
          <div className="emptyUserCard">
            <img src={avatars[props.userName.length % 8]} alt="user-avatar" />
          </div>
        )}
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(UserCard);
