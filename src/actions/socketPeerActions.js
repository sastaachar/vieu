import Peer from "peerjs";
import io from "socket.io-client";

import {
  SERVER_URL,
  PEER_SERVER_URL,
  PEER_PORT,
  SOCKETIO_CONNECTION_SENT,
  SOCKETIO_CONNECTION_CONNECTED,
  SOCKETIO_CONNECTION_FAIL,
  SOCKETIO_CONNECTION_LOST,
  PEER_CONNECTION_SENT,
  PEER_CONNECTION_CONNECTED,
  PEER_CONNECTION_FAIL,
  PEER_CONNECTION_LOST,
  USER_JOINED,
  USER_LEFT,
} from "./type";

export const connectToSocket = (cb) => (dispatch) => {
  // the given cb will be called once the conn is established
  dispatch({ type: SOCKETIO_CONNECTION_SENT });
  const socket = io.connect(SERVER_URL);

  // conected to socketio server
  socket.on("connect", () => {
    dispatch({ type: SOCKETIO_CONNECTION_CONNECTED, payload: socket });
    if (cb) cb(socket);
  });

  // could not establish connection
  socket.on("connect_error", (msg) => {
    dispatch({ type: SOCKETIO_CONNECTION_FAIL, payload: msg });
  });

  // socket connection disconnected
  socket.on("disconnect", () => {
    dispatch({ type: SOCKETIO_CONNECTION_LOST });
  });

  socket.on(USER_JOINED, (user) => {
    dispatch({ type: USER_JOINED, payload: user });
  });

  socket.on(USER_LEFT, (user) => {
    dispatch({ type: USER_LEFT, payload: user });
  });
};

export const connectToPeer = (cb) => (dispatch) => {
  // the given cb will be called once the conn is established
  dispatch({ type: PEER_CONNECTION_SENT });
  const peer = new Peer(null, {
    secure: true,
    host: PEER_SERVER_URL,
    port: PEER_PORT,
  });

  // connected to peerjs server
  peer.on("open", (peerId) => {
    dispatch({ type: PEER_CONNECTION_CONNECTED, payload: peerId });
    if (cb) cb(peerId);
  });

  // disconected from peerjs server
  peer.on("disconnected ", () => {
    dispatch({ type: PEER_CONNECTION_LOST });
  });

  // error occured
  peer.on("error", (err) => {
    dispatch({ type: PEER_CONNECTION_FAIL, payload: err });
  });
};
