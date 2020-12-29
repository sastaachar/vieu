import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// functions
import { getNewRoom } from "../../../actions/roomActions";

// assets
import GroupSvg from "./groupAsset";
import Logo from "../../shared/Logo/Logo";
import Divider from "../../../assets/Misc/clipPath.svg";

// components
import { SimpleBtn, SimpleInp } from "../../shared/Simple";

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
    <div className="mainPage-wrapper clear">
      <img src={Divider} id="divider" alt="divider" />
      <section className="mainPg-left">
        <Logo />

        <div className="mainPg-content">
          <div className="roomId-input">
            <label htmlFor="room_id">Enter Room id :</label>
            <SimpleInp
              id="room_id"
              type="text"
              onChange={(e) => setRoomid(e.target.value)}
            />
            <SimpleBtn onClick={handleCreateRoom}>
              <Link to={`/room/${room_id}`}>go</Link>
            </SimpleBtn>
          </div>
          <span>OR</span>
          <SimpleBtn onClick={handleCreateRoom}>
            <span>create room</span>
          </SimpleBtn>
          {props.roomReqLoading ? <span>Req sent...</span> : null}
        </div>
      </section>

      <section className="mainPg-right">
        <GroupSvg />
      </section>
      <nav className="mainNavBar">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </div>
  );
};

const mapStateToProps = (state) => ({
  roomReqLoading: state.roomData.loadingGetRoom,
});

export default connect(mapStateToProps, { getNewRoom })(MainPage);
