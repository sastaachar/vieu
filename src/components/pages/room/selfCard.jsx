import React, { useRef, useState } from "react";

import MovableCard from "../../shared/movableCard";
import { connect } from "react-redux";
import { useEffect } from "react";

const SelfCard = (props) => {
  const videoNode = useRef(null);

  const [panner, setPan] = useState(null);

  const startCapture = () => {
    console.log("awd");
    const getMedia = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    getMedia.then((stream) => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      let audioCtx = new AudioContext();

      const mediaStreamSource = audioCtx.createMediaStreamSource(stream);

      let panner = audioCtx.createStereoPanner();
      panner.pan.value = -10;

      mediaStreamSource.connect(panner);
      panner.connect(audioCtx.destination);

      setPan(panner);
      props.setStream(stream);
    });
  };

  useEffect(() => {
    if (!videoNode.current) return;

    videoNode.current.srcObject = props.stream;
  }, [props.stream]);

  const userStream = props.stream;

  return (
    <MovableCard>
      <div className="cardContainer">
        <video playsInline autoPlay ref={videoNode} />
        <span>this is me {props.userName}</span>
        <button
          onClick={() => {
            userStream.getVideoTracks()[0].enabled = !userStream.getVideoTracks()[0]
              .enabled;
          }}
        >
          mute video
        </button>
        <button
          onClick={() => {
            // userStream.getVideoTracks()[0].load();
            userStream.getAudioTracks()[0].enabled = !userStream.getAudioTracks()[0]
              .enabled;
          }}
        >
          mute audio
        </button>
        <button onClick={startCapture}>pan</button>
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(SelfCard);