import React, { useState } from "react";
import { connect } from "react-redux";

// components
import UseCard from "../cards/userCard";
import SelfCard from "../cards/selfCard";

// functions
import { updateStreamState } from "../../../../actions/streamActions";

// csss
import "./style.css";

// assets
import MicOn from "../../../../assets/Misc/mic-on.svg";
import MicOff from "../../../../assets/Misc/mic-off.svg";
import VidcamOn from "../../../../assets/Misc/videocam-on.svg";
import VidcamOff from "../../../../assets/Misc/videocam-off.svg";
import { useEffect } from "react";

const RoomDisplay = (props) => {
  const [myStream, setMyStream] = useState();

  useEffect(() => {
    console.log(props.connStatus);
  }, [props.connStatus]);

  const changeState = (kind) => {
    try {
      // flip the state of kind
      const { streamState } = props,
        otherKind = kind === "audio" ? "video" : "audio";

      // if kind is on
      if (streamState[kind]) {
        myStream.getTracks().forEach((track) => {
          if (track.kind === kind) track.stop();
        });
        // update local state
        props.updateStreamState(
          {
            [otherKind]: streamState[otherKind],
            [kind]: !streamState[kind],
          },
          props.socket
        );
      } else {
        // preserve other kind's state and flip current's state
        const getMedia = navigator.mediaDevices.getUserMedia({
          [kind]: true,
          [otherKind]: streamState[otherKind],
        });

        getMedia
          .then((stream) => {
            // stop all old tracks
            if (myStream) {
              myStream.getTracks().forEach((oldTracks) => {
                oldTracks.stop();
              });
            }

            // replace all senders stream
            const { senders, members } = props;
            const allStream = stream.getTracks();
            let kindTrack, otherTrack;
            allStream.forEach((track) => {
              if (track.kind === kind) kindTrack = track;
              else otherTrack = track;
            });

            // we need to send/replace our tracks
            // for all our users
            // TODO :- filter bloacked users
            members.forEach(({ user_id }) => {
              if (senders[user_id]) {
                // already sending streams
                let trackExists = false;
                senders[user_id].forEach((sender) => {
                  if (sender.track.kind === kind) {
                    trackExists = true;
                    sender.replaceTrack(kindTrack);
                  } else {
                    if (otherTrack) sender.replaceTrack(otherTrack);
                  }
                });
                // sending sterams but not this kind of track
                if (!trackExists) {
                  senders[user_id].push(
                    props.peers[user_id].addTrack(kindTrack, myStream)
                  );
                }
              } else {
                // need to add new sender
                // addTrack

                senders[user_id] = [
                  props.peers[user_id].addTrack(kindTrack, stream),
                ];
              }
            });
            props.updateStreamState(
              {
                [otherKind]: streamState[otherKind],
                [kind]: !streamState[kind],
              },
              props.socket
            );
            // need to replace my current stream with new one
            setMyStream(stream);
          })
          .catch(() => {});
      }
    } catch (err) {
      if (err instanceof MediaError) {
        alert("Device not available");
      } else {
        console.log(err);
      }
    }
  };

  const micImg = props.streamState.audio ? MicOn : MicOff;
  const vidImg = props.streamState.video ? VidcamOn : VidcamOff;

  return (
    <div className="simple-layout roomDisplay-wrapper">
      <div className="roomDisplay-box">
        <div className="peerDisplay">
          {props.members.map(({ user_id, userName }) => (
            <UseCard
              key={user_id}
              user_id={user_id}
              userName={userName}
              peer={props.peers[user_id]}
              myStream={myStream}
              peerStream={props.streams[user_id]}
              senders={props.senders}
              connected={props.connStatus[user_id]}
            />
          ))}
        </div>
        <SelfCard
          key={props.my_id}
          userName={props.userName}
          setMyStream={setMyStream}
          senders={props.senders}
          stream={myStream}
        />
        <div className="controllPanel">
          <button
            className="btnCtrl"
            style={{ backgroundImage: `url(${micImg})` }}
            onClick={() => changeState("audio")}
          />
          <button
            className="btnCtrl"
            style={{ backgroundImage: `url(${vidImg})` }}
            onClick={() => changeState("video")}
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
