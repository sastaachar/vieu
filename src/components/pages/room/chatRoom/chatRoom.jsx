import React, { useEffect } from "react";
import { connect } from "react-redux";

// components
import UserCard from "../cards/card";

// functions
import { updateStreamState } from "../../../../actions/streamActions";

// csss
import "./style.css";

// assets
import MicOn from "../../../../assets/Misc/mic-on.svg";
import MicOff from "../../../../assets/Misc/mic-off.svg";
import VidcamOn from "../../../../assets/Misc/videocam-on.svg";
import VidcamOff from "../../../../assets/Misc/videocam-off.svg";

const RoomDisplay = (props) => {
  // props from PeerAdapter
  const {
    incomingTracks,
    userStreams,
    setTrack,
    // connStatus,
    //stopIncomingTracks,
    stopOutgoingTracks,
    // startConnection,
  } = props;

  useEffect(() => {
    // connect with everyone
    console.log("Calling everyone");
    props.startConnection(members);
  }, []);

  const getTrack = (trackType, cb) => {
    if (trackType === "userVideo") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoTracks = stream.getVideoTracks();
          cb(videoTracks[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (trackType === "userAudio") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioTracks = stream.getAudioTracks();
          cb(audioTracks[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (trackType === "screenVideo") {
    }
  };

  const changeState = (trackType) => {
    if (!["userVideo", "userAudio", "screenVideo"].includes(trackType)) {
      // not a valid trackType
      return;
    }
    if (streamState[trackType]) {
      stopOutgoingTracks(trackType);
      props.updateStreamState({ [trackType]: false });
    } else {
      // get a track and send
      getTrack(trackType, (track) => {
        setTrack(track, trackType);
        props.updateStreamState({ [trackType]: true });
      });
    }
  };

  const micImg = props.streamState.userAudio ? MicOn : MicOff;
  const vidImg = props.streamState.userVideo ? VidcamOn : VidcamOff;
  const { streamState, members } = props;
  return (
    <div className="roomDisplay-wrapper">
      <div className="roomDisplay-box">
        <div className="peerDisplay">
          {props.members.map(({ user_id, userName }) => (
            <UserCard
              key={user_id}
              user_id={user_id}
              userName={userName}
              streams={incomingTracks[user_id] || {}}
              setTrack={setTrack}
            />
          ))}
        </div>
        <UserCard
          key={props.my_id}
          user_id={props.my_id}
          userName={"Me : " + props.userName}
          streams={userStreams || {}}
          setTrack={setTrack}
        />
        <div className="controllPanel">
          <button
            className="btnCtrl"
            style={{ backgroundImage: `url(${micImg})` }}
            onClick={() => changeState("userAudio")}
          />
          <button
            className="btnCtrl"
            style={{ backgroundImage: `url(${vidImg})` }}
            onClick={() => changeState("userVideo")}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  members: state.roomData.members,
  my_id: state.roomData.myData.user_id,
  userName: state.roomData.myData.userName,
  streamState: state.streamData,
  socket: state.socketData.socket,
});
export default connect(mapStateToProps, { updateStreamState })(RoomDisplay);
