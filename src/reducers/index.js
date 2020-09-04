import { combineReducers } from "redux";

import roomreducer from "./roomReducer";
import socketReducer from "./socketReducer";

export default combineReducers({
  roomData: roomreducer,
  socketData: socketReducer,
});
