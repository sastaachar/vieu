import {
  PEER_CONNECTION_SENT,
  PEER_CONNECTION_CONNECTED,
  PEER_CONNECTION_FAIL,
  PEER_CONNECTION_LOST,
} from "./../actions/type";

const initialState = {
  loading: false,
  connected: false,
  error: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PEER_CONNECTION_SENT:
      return {
        ...state,
        loading: true,
        connected: false,
        error: "",
      };

    case PEER_CONNECTION_CONNECTED:
      return {
        ...state,
        loading: false,
        peerId: action.payload,
        connected: true,
        error: "",
      };

    case PEER_CONNECTION_FAIL:
      return {
        ...state,
        loading: false,
        connected: false,
        peerId: undefined,
        error: action.payload,
      };

    case PEER_CONNECTION_LOST:
      return {
        ...state,
        loading: false,
        connected: false,
        peerId: undefined,
      };
    default:
      return state;
  }
}
