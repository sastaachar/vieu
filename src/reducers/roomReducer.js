import {
  CREATE_NEW_ROOM_SENT,
  CREATE_NEW_ROOM_RCV,
  CREATE_NEW_ROOM_FAIL,
  CHECK_ROOM_ID_SENT,
  CHECK_ROOM_ID_RCV,
  CHECK_ROOM_ID_FAIL,
  JOIN_ROOM_SENT,
  JOIN_ROOM_SUCESS,
  JOIN_ROOM_FAIL,
  JOIN_ROOM_ERROR,
  USER_JOINED,
  USER_LEFT,
} from "../actions/type";

const initialState = {
  loadingGetRoom: false,
  loadingCheckRoom: false,
  loadingJoinRoom: false,
  roomJoined: false,
  exists: false,
  error: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    // create a new room
    case CREATE_NEW_ROOM_SENT:
      return {
        ...state,
        loadingGetRoom: true,
      };
    case CREATE_NEW_ROOM_RCV:
      return {
        ...state,
        room_id: action.payload.room_id,
        loadingGetRoom: false,
      };
    case CREATE_NEW_ROOM_FAIL:
      return {
        ...state,
        loadingGetRoom: false,
        error: action.payload.error,
      };
    // check if room exists
    case CHECK_ROOM_ID_SENT:
      return {
        ...state,
        loadingCheckRoom: true,
      };
    case CHECK_ROOM_ID_RCV:
      return {
        ...state,
        loadingCheckRoom: false,
        chkMembers: action.payload.members,
        exists: action.payload.exists,
      };
    case CHECK_ROOM_ID_FAIL:
      return {
        ...state,
        loadingCheckRoom: false,
        error: "Socket error",
      };
    // join a room
    case JOIN_ROOM_SENT:
      return {
        ...state,
        loadingJoinRoom: true,
      };
    case JOIN_ROOM_SUCESS:
      return {
        ...state,
        loadingJoinRoom: false,
        roomJoined: true,
        members: action.payload.members,
      };
    case JOIN_ROOM_FAIL:
      return {
        ...state,
        loadingJoinRoom: false,
        roomJoined: action.payload.message === "AIR",
        error: action.payload,
      };
    case JOIN_ROOM_ERROR:
      return {
        ...state,
        loadingJoinRoom: false,
        roomJoined: action.payload.message === "AIR",
        error: action.payload,
      };
    case USER_JOINED:
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    case USER_LEFT:
      return {
        ...state,
        members: state.members.filter(
          ({ user_id }) => user_id !== action.payload.user_id
        ),
      };
    default:
      return state;
  }
}
