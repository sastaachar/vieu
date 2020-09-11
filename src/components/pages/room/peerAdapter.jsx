import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";

const PeerAdapter = (props) => {
  // stores the actuall peers
  const peers = useRef({});

  // all incoming streams
  const [streams, setStreams] = useState({});

  // outgoing stream senders
  const senders = useRef({});

  const createPeer = (user_id) => {
    if (peers.current[user_id]) {
      // a connection already exists
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
      setStreams({ ...streams, [user_id]: e.streams[0] });
    };
    const callUser = () => {
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
    // need to negotiate || re-negotiate
    peer.onnegotiationneeded = callUser;
    // to call the user
    peer.callUser = callUser;

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

    console.log("Effect called...");
    const socket = { props };
    socket.on(
      "OFFER",
      (offer) => {
        // got a offer
        const user_id = offer.caller;

        let remotePeer = peers.current[user_id];
        if (!remotePeer) {
          // new user , first connection
          remotePeer = createPeer(offer.caller);
        }
        // the offer desc we got
        const desc = new RTCSessionDescription(offer.sdp);

        remotePeer
          .setRemoteDescription(desc)
          .then(() => {
            // answer the call
            return newPeer.createAnswer();
          })
          .then((answer) => {
            return newPeer.setLocalDescription(answer);
          })
          .then(() => {
            // send answer
            const payload = {
              target: user_id,
              sdp: newPeer.localDescription,
            };
            props.socket.emit("ANSWER", payload);
          });
      },
      [props.socket]
    );

    socket.on("ANSWER", (incoming) => {
      // peer accepted our call
      // handle answer
      console.log("Recieved a answer...");
      const desc = new RTCSessionDescription(incoming.sdp);
      peers.current[incoming.caller]
        .setRemoteDescription(desc)
        .catch((e) => console.log(e));
    });

    socket.on("ICE_CANDIDATE", (iceCandidateMsg) => {
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

  return (
    <>
      {React.cloneElement(props.children[0], {
        // all the remote peers
        peers: peers.current,
        // all the remote streams
        streams,
        // senders of my stream
        senders,
      })}
    </>
  );
};

const mapStateToProps = (state) => ({
  socket: state.socketData.socket,
});

export default connect(mapStateToProps, null)(PeerAdapter);
