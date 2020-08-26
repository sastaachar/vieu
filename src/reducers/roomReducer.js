import {
  CHECK_ROOM_ID_SENT,
  CHECK_ROOM_ID_RCV,
  CHECK_ROOM_ID_FAIL,
} from "../actions/type";

const initialState = {
  loading: false,
  error: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHECK_ROOM_ID_SENT:
      return {
        ...state,
        loading: true,
      };
    case CHECK_ROOM_ID_RCV:
      return {
        ...state,
        exists: action.payload.exists,
        loading: false,
      };
    case CHECK_ROOM_ID_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
