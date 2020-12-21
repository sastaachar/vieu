//TODO : remove this

import { CHANGE_STREAM_STATE } from "../actions/type";

const initialState = {
  userVideo: false,
  userAudio: false,
  screenVideo: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    // create a new room
    case CHANGE_STREAM_STATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
