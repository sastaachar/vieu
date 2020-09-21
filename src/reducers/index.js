import { combineReducers } from "redux";

import roomreducer from "./roomReducer";
import socketReducer from "./socketReducer";
import streamReducer from "./streamReducer";

export default combineReducers({
  roomData: roomreducer,
  socketData: socketReducer,
  streamData: streamReducer,
});
