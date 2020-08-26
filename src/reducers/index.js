import { combineReducers } from "redux";

import roomreducer from "./roomReducer";
import socketReducer from "./socketReducer";
import peerReducer from "./peerReducer";

export default combineReducers({
  roomData: roomreducer,
  socketData: socketReducer,
  peerData: peerReducer,
});
