import React, { useRef, useEffect } from "react";

import MovableCard from "../../shared/movableCard";
import { connect } from "react-redux";

const UserCard = (props) => {
  const videoNode = useRef(null);

  const callUser = () => {
    const { myPeer, user_id, stream } = props;
    const call = myPeer.call(user_id, stream);

    call.on("stream", (userStream) => {
      videoNode.current.srcObj = userStream;
    });
  };

  return (
    <MovableCard>
      <div className="cardContainer">
        <span>{props.userName}</span>
        <button onClick={callUser}>send</button>
        <video playsInline autoPlay ref={videoNode} />
      </div>
    </MovableCard>
  );
};

const mapStateToProps = (state) => ({
  myPeer: state.peerData.peer,
});

export default connect(mapStateToProps, null)(UserCard);
