import { CHANGE_STREAM_STATE } from "../actions/type";

const initialState = {
  video: false,
  audio: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    // create a new room
    case CHANGE_STREAM_STATE:
      return {
        ...state,
        video: action.payload.video,
        audio: action.payload.audio,
      };

    default:
      return state;
  }
}
