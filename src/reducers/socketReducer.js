import {
  SOCKETIO_CONNECTION_SENT,
  SOCKETIO_CONNECTION_CONNECTED,
  SOCKETIO_CONNECTION_FAIL,
  SOCKETIO_CONNECTION_LOST,
  SOCKETIO_CONNECTION_RETRY,
} from "./../actions/type";

const initialState = {
  loading: false,
  error: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SOCKETIO_CONNECTION_SENT:
      return {
        ...state,
        loading: true,
        connected: false,
        error: "",
      };
    case SOCKETIO_CONNECTION_CONNECTED:
      return {
        ...state,
        loading: false,
        socket: action.payload,
        connected: true,
        error: "",
      };
    case SOCKETIO_CONNECTION_FAIL:
      return {
        ...state,
        loading: false,
        connected: false,
        socket: undefined,
        error: action.payload,
      };
    case SOCKETIO_CONNECTION_LOST:
      return {
        ...state,
        loading: false,
        connected: false,
        socket: undefined,
      };
    case SOCKETIO_CONNECTION_RETRY:
      return {
        ...state,
      };
    default:
      return state;
  }
}
