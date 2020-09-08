import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

// componenets
import UseCard from "./userCard";
import SelfCard from "./selfCard";

// functions
import { connectToSocket } from "../../../actions/socketPeerActions";
import { checkRoom, joinRoom } from "../../../actions/roomActions";

// css
import "./room_page.css";

const RoomPage = (props) => {
  // storing all peers in a room
  const peers = useRef({});
  const setPeers = (newPeers, cb) => {
    peers.current = newPeers;
    if (cb) cb();
  };

  const [myStream, setStream] = useState(null);
  const [userName, setUserName] = useState();
  const room_id = props.match.params.room_id;

  useEffect(() => {
    props.connectToSocket((socket) => {
      props.checkRoom({ socket, room_id });
    });
  }, []);

  const callUser = (user_id) => {
    if (peers.current[user_id]) {
      console.log("Already connected");
      return;
    }
    console.log(`Calling ${user_id}`);
    const newPeer = createPeer(user_id);
    setPeers({ ...peers.current, [user_id]: newPeer }, () => {
      makeChannel(user_id);
    });
  };

  const makeChannel = (user_id) => {
    var channel = peers.current[user_id].createDataChannel("chat");
    channel.onopen = function (event) {
      channel.send("Hi you!");
    };
    channel.onmessage = function (event) {
      console.log(event.data);
    };
  };

  const createPeer = (user_id) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.stunprotocol.org"],
        },
      ],
    });
    peer.ondatachannel = function (event) {
      var channel = event.channel;
      channel.onopen = function (event) {
        channel.send("Hi back!");
      };
      channel.onmessage = function (event) {
        console.log(event.data);
      };
    };
    peer.onicecandidate = (e) => handleICECandidateEvent(e, user_id);
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(user_id);
    return peer;
  };

  // me to peer

  const handleICECandidateEvent = (e, user_id) => {
    if (e.candidate) {
      const payload = {
        target: user_id,
        candidate: e.candidate,
      };
      props.socket.emit("ICE_CANDIDATE", payload);
    }
  };
  const handleTrackEvent = (e) => {
    console.log("Track", e);
  };

  const handleNegotiationNeededEvent = (user_id) => {
    console.log("Sending offer..");
    peers.current[user_id]
      .createOffer()
      .then((newOffer) => {
        return peers.current[user_id].setLocalDescription(newOffer);
      })
      .then(() => {
        const payload = {
          target: user_id,
          sdp: peers.current[user_id].localDescription,
        };
        props.socket.emit("OFFER", payload);
      })
      .catch((e) => console.log(e));
  };

  // peer to me

  // me to server
  const handleJoinRoom = () => {
    const { socket } = props;

    if (!userName || !room_id) return;

    props.joinRoom(
      {
        socket,
        data: { room_id, userName },
      },
      (roomJoined) => {
        if (roomJoined) {
          // add listners for peer connections
          socket.on("OFFER", (offer) => {
            // hanlde offer
            const newPeer = createPeer(offer.caller);
            setPeers({
              ...peers.current,
              [offer.caller]: createPeer(offer.caller),
            });
            const desc = new RTCSessionDescription(offer.sdp);
            newPeer
              .setRemoteDescription(desc)
              .then(() => {
                return newPeer.createAnswer();
              })
              .then((answer) => {
                return newPeer.setLocalDescription(answer);
              })
              .then(() => {
                const payload = {
                  target: offer.caller,
                  sdp: newPeer.localDescription,
                };
                console.log("Sending answer...");
                props.socket.emit("ANSWER", payload);
              });
          });

          socket.on("ANSWER", (incoming) => {
            // handle answer
            console.log("Recieved a answer...");
            const desc = new RTCSessionDescription(incoming.sdp);
            peers.current[incoming.caller]
              .setRemoteDescription(desc)
              .catch((e) => console.log(e));
          });

          socket.on("ICE_CANDIDATE", (iceCandidateMsg) => {
            const candidate = new RTCIceCandidate(iceCandidateMsg.candidate);

            peers.current[iceCandidateMsg.caller]
              .addIceCandidate(candidate)
              .catch((e) => console.log(e));
          });
        }
      }
    );
  };

  return (
    <div className="room-page-container">
      {props.socketConnected && props.exists && !props.roomJoined ? (
        <div>
          <input
            type="text"
            name="userName"
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleJoinRoom}>join room</button>
        </div>
      ) : null}
      {props.roomJoined
        ? props.members.map(({ user_id, userName }) => (
            <UseCard
              key={user_id}
              callUser={() => callUser(user_id)}
              userName={userName}
              user_id={user_id}
              stream={myStream}
            />
          ))
        : null}
      {props.roomJoined ? (
        <SelfCard
          key={props.my_id}
          userName={userName}
          stream={myStream}
          setStream={setStream}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  socketLoading: state.socketData.loading,
  socketConnected: state.socketData.connected,
  socket: state.socketData.socket,
  my_id: state.roomData.myData.user_id,
  loadingGetRoom: state.roomData.loadingGetRoom,
  loadingCheckRoom: state.roomData.loadingCheckRoom,
  loadingJoinRoom: state.roomData.loadingJoinRoom,
  roomJoined: state.roomData.roomJoined,
  members: state.roomData.members,
  exists: state.roomData.exists,
});

export default connect(mapStateToProps, {
  connectToSocket,
  checkRoom,
  joinRoom,
})(RoomPage);
