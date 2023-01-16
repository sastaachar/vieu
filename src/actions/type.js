export const CHECK_ROOM_ID_SENT = "CHECK_ROOM_ID_SENT";
export const CHECK_ROOM_ID_RCV = "CHECK_ROOM_ID_RCV";
export const CHECK_ROOM_ID_FAIL = "CHECK_ROOM_ID_FAIL";

export const CREATE_NEW_ROOM_SENT = "CREATE_NEW_ROOM_SENT";
export const CREATE_NEW_ROOM_RCV = "CREATE_NEW_ROOM_RCV";
export const CREATE_NEW_ROOM_FAIL = "CREATE_NEW_ROOM_FAIL";

export const SOCKETIO_CONNECTION_SENT = "SOCKETIO_CONNECTION_SENT";
export const SOCKETIO_CONNECTION_CONNECTED = "SOCKETIO_CONNECTION_CONNECTED";
export const SOCKETIO_CONNECTION_FAIL = "SOCKETIO_CONNECTION_FAIL";
export const SOCKETIO_CONNECTION_LOST = "SOCKETIO_CONNECTION_LOST";
export const SOCKETIO_CONNECTION_RETRY = "SOCKETIO_CONNECTION_RETRY";

export const SENDING_PEER_OFFER = "SENDING_PEER_OFFER";

export const JOIN_ROOM_SENT = "JOIN_ROOM_SENT";
export const JOIN_ROOM_SUCESS = "JOIN_ROOM_SUCESS";
export const JOIN_ROOM_FAIL = "JOIN_ROOM_FAIL";
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR";

export const USER_JOINED = "USER_JOINED";
export const USER_LEFT = "USER_LEFT";

export const CHANGE_STREAM_STATE = "CHANGE_STREAM_STATE";

// urls

//peer server on heroku
export const PEER_SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "localhost"
    : "vieu-peer.herokuapp.com";

export const PEER_PORT = process.env.NODE_ENV === "development" ? 9000 : 443;

export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://vieu-server-production.up.railway.app";
