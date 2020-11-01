import React, { useRef, useState } from "react";

import MovableCard from "../../../shared/movableCard";
import { connect } from "react-redux";
import { useEffect } from "react";
import { updateStreamState } from "../../../../actions/streamActions";

import "./style.css";

const SelfCard = (props) => {
  const videoNode = useRef(null);

  //const [panner, setPan] = useState(null);

  useEffect(() => {
    if (videoNode.current && props.stream) {
      videoNode.current.srcObject = props.stream;
    }
    console.log("got new stream", props.stream);
  }, [props.stream]);

  return (
    <MovableCard>
      <div className="cardContainer">
        <video
          playsInline
          autoPlay
          muted
          controls={props.streamState.video || props.streamState.audio}
          ref={videoNode}
        />
        <div className="minControllPanel">
          {props.streamState.video ? <span>v</span> : null}
          {props.streamState.audio ? <span>a</span> : null}
        </div>
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({
  streamState: state.streamData,
});

export default connect(mapStateToProps, { updateStreamState })(SelfCard);
