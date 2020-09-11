import React, { useRef, useState } from "react";

import MovableCard from "../../shared/movableCard";
import { connect } from "react-redux";
import { useEffect } from "react";

const SelfCard = (props) => {
  const videoNode = useRef(null);

  const [panner, setPan] = useState(null);

  useEffect(() => {
    if (videoNode.current) {
      videoNode.current.srcObject = props.stream;
    }
  }, [props.stream]);

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
      panner.pan.value = -1;

      mediaStreamSource.connect(panner);
      panner.connect(audioCtx.destination);

      setPan(panner);

      props.setStream(stream);
    });
  };

  const userStream = props.stream;

  return (
    <MovableCard>
      <div className="cardContainer">
        <video playsInline autoPlay ref={videoNode} />
        <span>this is me {props.userName}</span>
        <button
          onClick={() => {
            userStream.getVideoTracks()[0].enabled = !userStream
              .getVideoTracks()[0]
              .stop();
          }}
        >
          mute video
        </button>
        <button
          onClick={() => {
            const getMedia = navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
            });

            getMedia
              .then((stream) => {
                const videoTrack = stream.getTracks()[1];
                console.log("new track ", videoTrack);
                Object.entries(props.senders).forEach((ele) => {
                  const senderList = ele[1];
                  console.log("Replacing track ", senderList);
                  senderList.forEach((sender) => {
                    if (sender.track.kind === "video") {
                      console.log("Replacing track ", sender);
                      sender.replaceTrack(videoTrack);
                    }
                  });
                });
                props.setStream(stream);
              })
              .catch((e) => console.log(e));
          }}
        >
          video again
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
