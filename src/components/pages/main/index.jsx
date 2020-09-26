import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getNewRoom } from "../../../actions/roomActions";

import "./style.css";

const MainPage = (props) => {
  const [room_id, setRoomid] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleCreateRoom = (e) => {
    // send GET req to server
    e.preventDefault();
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
    <div className="mainPage-wrapper simple-layout">
      <div className="mainPage-box ">
        <section className="roomIdInputs">
          <label htmlFor="room_id">Enter Room id :</label>
          <div>
            <input
              id="room_id"
              type="text"
              onChange={(e) => setRoomid(e.target.value)}
            />
            <Link to={`/room/${room_id}`} className="simple-btn">
              go
            </Link>
          </div>
        </section>
        <section className="createRoom">
          <a onClick={handleCreateRoom} href="#" className="simple-btn">
            create room
          </a>
          {props.roomReqLoading ? <span>Req sent...</span> : null}
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  roomReqLoading: state.roomData.loadingGetRoom,
});

export default connect(mapStateToProps, { getNewRoom })(MainPage);
