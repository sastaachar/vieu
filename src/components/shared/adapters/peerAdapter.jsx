import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

const PeerAdapter = (props) => {
  // stores the actuall peers
  const peers = useRef({});

  // all incoming streams
  const [streams, setStreams] = useState({});

  // outgoing stream senders
  const senders = useRef({});

  // connection answered
  const [connStatus, setStatus] = useState({});

  const callPeer = (user_id) => {
    console.log(peers.current);
    // craete a offer , send
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
  const createPeer = (user_id) => {
    if (peers.current[user_id]) {
      // a connection already exists
      console.log("createPeer -> a connection already exists");
      return;
    }

    // new peer
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.stunprotocol.org"],
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
        props.socket.emit("ICE_CANDIDATE", payload);
      }
    };
    // got new track for a remote peer i.e user_id
    peer.ontrack = (e) => {
      // new track is e.streams[0]
      console.log("new treack from ", user_id);
      setStreams({ ...streams, [user_id]: e.streams[0] });
    };

    // need to negotiate || re-negotiate
    peer.onnegotiationneeded = () => callPeer(user_id);

    // store this peer in peers
    peers.current[user_id] = peer;

    return peer;
  };

  useEffect(() => {
    // we only depend on socket changes
    // run this just once
    // prereq - user is in a room

    // skip the first call
    if (!props.socket) return;

    const { socket } = props;

    props.socket.on(
      "OFFER",
      (offer) => {
        // got a offer
        console.log("PeerAdapter -> got a offer");
        const user_id = offer.caller;

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
            setStatus({ ...connStatus, [user_id]: true });
            console.log(connStatus);
            props.socket.emit("ANSWER", payload);
          });
      },
      [props.socket]
    );

    props.socket.on("ANSWER", (incoming) => {
      // peer accepted our call
      // handle answer
      console.log(
        "PeerAdapter -> // peer accepted our call Recieved a answer..."
      );
      const desc = new RTCSessionDescription(incoming.sdp);

      peers.current[incoming.caller]
        .setRemoteDescription(desc)
        .then((data) => {
          // set conn as true
          setStatus({ ...connStatus, [incoming.caller]: true });
        })
        .catch((e) => console.log(e));
    });

    props.socket.on("ICE_CANDIDATE", (iceCandidateMsg) => {
      // add the ice as soon as we get
      // TODO - may change add based of remoteDesc status
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
        // all the remote peers
        peers: peers.current,
        // all the remote streams
        streams,
        // senders of my stream
        senders: senders.current,
        // connnection status of all peers
        connStatus,
        // to create a new peer
        createPeer,
        callPeer,
      })}
    </>
  );
};

const mapStateToProps = (state) => ({
  socket: state.socketData.socket,
});

export default connect(mapStateToProps, null)(PeerAdapter);
