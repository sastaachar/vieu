import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { getNewRoom } from "../../../actions/roomActions";

const MainPage = (props) => {
  const [room_id, setRoomid] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleCreateRoom = (e) => {
    // send GET req to server
    props.getNewRoom((data) => {
      // get new id and redirect
      setRoomid(data.room_id);
      setRedirect(true);
    });
  };

  if (redirect) {
    return <Redirect to={`/room/${room_id}`} />;
  }

  return (
    <div className="mainPage-container">
      <label htmlFor="room_id">Enter Room id</label>
      <input
        id="room_id"
        type="text"
        onChange={(e) => setRoomid(e.target.value)}
      />
      <button onClick={() => setRedirect(true)}> Go </button>
      {props.roomReqLoading ? <span>Req sent...</span> : null}
      <button onClick={handleCreateRoom}> Create room </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  roomReqLoading: state.roomData.loadingGetRoom,
});

export default connect(mapStateToProps, { getNewRoom })(MainPage);
