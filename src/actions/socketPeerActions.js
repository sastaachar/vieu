import Peer from "peerjs";
import io from "socket.io-client";

import {
  SOCKETIO_CONNECTION_SENT,
  SOCKETIO_CONNECTION_CONNECTED,
  SOCKETIO_CONNECTION_FAIL,
  SOCKETIO_CONNECTION_LOST,
  PEER_CONNECTION_SENT,
  PEER_CONNECTION_CONNECTED,
  PEER_CONNECTION_FAIL,
  PEER_CONNECTION_LOST,
  SERVER_URL,
} from "./type";

export const connectToSocket = (cb) => (dispatch) => {
  // the given cb will be called once the conn is established
  dispatch({ type: SOCKETIO_CONNECTION_SENT });
  const socket = io.connect(SERVER_URL);

  // conected to socketio server
  socket.on("connect", () => {
    if (cb) cb(socket);
    dispatch({ type: SOCKETIO_CONNECTION_CONNECTED, payload: socket });
  });

  // could not establish connection
  socket.on("connect_failed", (msg) => {
    dispatch({ type: SOCKETIO_CONNECTION_FAIL, payload: msg });
  });

  // socket connection disconnected
  socket.on("disconnected", () => {
    dispatch({ type: SOCKETIO_CONNECTION_LOST });
  });

  socket.on("USER_JOINED", (user_id) => {
    alert(user_id + " joined");
  });
};

export const connectToPeer = (cb) => (dispatch) => {
  // the given cb will be called once the conn is established
  dispatch({ type: PEER_CONNECTION_SENT });
  const peer = new Peer();

  // connected to peerjs server
  peer.on("open", (peerId) => {
    if (cb) cb(peerId);
    dispatch({ type: PEER_CONNECTION_CONNECTED, payload: peerId });
  });

  // disconected from peerjs server
  peer.on("disconnected ", () => {
    dispatch({ type: PEER_CONNECTION_LOST });
  });

  // error occured
  peer.on("error", (err) => {
    dispatch({ type: PEER_CONNECTION_FAIL, payload: err.type });
  });
};
