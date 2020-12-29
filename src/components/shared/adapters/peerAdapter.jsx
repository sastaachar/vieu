import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

const PeerAdapter = (props) => {
  // stores and access the actuall peers
  const peers = useRef({});
  // outgoing stream senders
  const senders = useRef({});

  // all incoming streams
  const [incomingTracks, setIncomingtracks] = useState({});
  // all of users tracks
  const [userStreams, setStreams] = useState({
    userVideo: null,
    userAudio: null,
    screenVideo: null,
  });

  // connection answered
  // this will be usefull for knowing the existing connections
  const [connStatus, setStatus] = useState({});

  const newConn = (user_id) => {
    setStatus((prevState) => {
      // returning { ...prevState, [user_id]: true } directly wont work
      const newState = { ...prevState, [user_id]: true };
      return newState;
    });
  };

  const callPeer = (user_id) => {
    // craete a offer , send
    peers.current[user_id]
      .createOffer()
      .then((newOffer) => {
        console.log("Made new offer ", newOffer);
        return peers.current[user_id].setLocalDescription(newOffer);
      })
      .then(() => {
        const payload = {
          target: user_id,
          sdp: peers.current[user_id].localDescription,
        };
        console.log("Sending new offer ", payload);
        props.socket.emit("OFFER", payload);
      })
      .catch((e) => console.log(e));
  };

  const createPeer = (user_id) => {
    if (peers.current[user_id]) {
      // a connection already exists
      return peers.current[user_id];
    }

    // new peer
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun4.l.google.com",
            "stun:stun3.l.google.com",
            "stun:stun2.l.google.com",
            "stun:stun1.l.google.com",
            "stun:stun.l.google.com:19302",
          ],
        },
        {
          urls: "turn:relay.backups.cz",
          credential: "webrtc",
          username: "webrtc",
        },
        {
          urls: "turn:relay.backups.cz?transport=tcp",
          credential: "webrtc",
          username: "webrtc",
        },
      ],
    });

    // all payload.caller will be set by server while transport

    // send ice to peer

    peer.onicecandidate = (e) => {
      // onicecandidate hanlder
      if (e.candidate) {
        const payload = {
          target: user_id,
          candidate: e.candidate,
        };
        console.log("Sending a icecandidate ", payload);
        props.socket.emit("ICE_CANDIDATE", payload);
      }
    };
    // got new track for a remote peer i.e user_id
    peer.ontrack = (e) => {
      // new track is e.streams[0]
      //TODO : a way to recogize which track is being send

      const trackType =
        e.streams[0].getTracks()[0].kind === "video"
          ? incomingTracks[user_id] && incomingTracks[user_id].userVideo
            ? "screenVideo"
            : "userVideo"
          : "userAudio";

      console.log(
        trackType,
        e.streams[0].getTracks()[0].kind,
        incomingTracks[user_id]
      );

      setIncomingtracks({
        ...incomingTracks,
        [user_id]: { [trackType]: e.streams[0] },
      });
    };

    // need to negotiate || re-negotiate
    peer.onnegotiationneeded = () => callPeer(user_id);

    // store this peer in peers
    peers.current[user_id] = peer;

    return peer;
  };

  const startConnection = (users) => {
    // connect = create + call

    // this is done so even if client passes single value this fn is valid
    const allUsers = [].concat(users || []);

    allUsers.forEach((user) => {
      if (peers.current[user]) {
        console.log("Already connected");
        return;
      }
      createPeer(user.user_id);
      callPeer(user.user_id);
    });
  };

  const setTrack = (track, trackType) => {
    if (!["userVideo", "userAudio", "screenVideo"].includes(trackType)) {
      // not a valid trackType
      return;
    }

    const newStream = new MediaStream([track]);
    setStreams({ ...userStreams, [trackType]: newStream });

    // send track to all
    //BUG : he native webrtc doesnt seem to support multiple video on same peer object
    for (const user_id in peers.current) {
      const sender = peers.current[user_id].addTrack(track, newStream);
      if (!senders.current[user_id]) {
        senders.current[user_id] = {
          userVideo: null,
          userAudio: null,
          screenVideo: null,
        };
      }
      senders.current[user_id][trackType] = sender;
    }
  };

  // stop trackTypes for the given users
  const stopOutgoingTracks = (trackType, users) => {
    // perform sender.stop for all the users

    userStreams[trackType].getTracks()[0].stop();
    setStreams({ ...userStreams, [trackType]: null });
  };

  // stop trackTypes for the given users
  const stopIncomingTracks = (users, trackTypes) => {
    // perform track.stop for all corresponding track in streams
  };

  useEffect(() => {
    // we only depend on socket changes
    // run this just once
    // prereq - user is in a room
    const { socket } = props;
    // skip the first call
    if (!socket) return;

    console.log("Setting up socket", socket);

    // initialize all the necessary
    socket.on("OFFER", (offer) => {
      // got a offer

      const user_id = offer.caller;
      console.log("Got offer from", user_id, " offer ", offer);

      let newRemotePeer = peers.current[user_id];
      if (!newRemotePeer) {
        // new user , first connection
        newRemotePeer = createPeer(offer.caller);
      }
      // the offer desc we got
      const desc = new RTCSessionDescription(offer.sdp);

      newRemotePeer
        .setRemoteDescription(desc)
        .then(() => {
          // answer the call
          return newRemotePeer.createAnswer();
        })
        .then((answer) => {
          return newRemotePeer.setLocalDescription(answer);
        })
        .then(() => {
          // send answer
          const payload = {
            target: user_id,
            sdp: newRemotePeer.localDescription,
          };
          newConn(user_id);
          console.log("Seding reply ", payload);
          props.socket.emit("ANSWER", payload);
        });
    });

    socket.on("ANSWER", (incoming) => {
      // peer accepted our call
      // handle answer

      const desc = new RTCSessionDescription(incoming.sdp);

      peers.current[incoming.caller]
        .setRemoteDescription(desc)
        .then(() => {
          // set conn as true
          console.log("Got back reply from", incoming.caller);
          newConn(incoming.caller);
        })
        .catch((e) => console.log(e));
    });

    socket.on("ICE_CANDIDATE", (iceCandidateMsg) => {
      // add the ice as soon as we get
      // TODO - may change add based of remoteDesc status
      console.log("Got a icecandidate ", iceCandidateMsg);
      const candidate = new RTCIceCandidate(iceCandidateMsg.candidate);
      peers.current[iceCandidateMsg.caller]
        .addIceCandidate(candidate)
        .catch((e) => console.log(e));
    });

    // cleanup
    return () => {
      console.log("Cleanup called...");
      socket.off("OFFER");
      socket.off("ANSWER");
      socket.off("ICE_CANDIDATE");
    };
  }, [props.socket]);

  // the children will be passed with new props
  return (
    <>
      {React.cloneElement(props.children, {
        // all the remote streams
        incomingTracks,
        // connnection status of all peers
        connStatus,
        // users tracks
        userStreams: userStreams,
        // set track
        setTrack,
        // stop recieving a track to users
        stopIncomingTracks,
        // stop sending a track to users
        stopOutgoingTracks,
        // start a connection with a user
        startConnection,
        //TODO : add stopConnection
      })}
    </>
  );
};

const mapStateToProps = (state) => ({
  socket: state.socketData.socket,
});

export default connect(mapStateToProps, null)(PeerAdapter);
