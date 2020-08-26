import {
  CHECK_ROOM_ID_SENT,
  CHECK_ROOM_ID_RCV,
  CHECK_ROOM_ID_FAIL,
  CREATE_NEW_ROOM_SENT,
  CREATE_NEW_ROOM_RCV,
  CREATE_NEW_ROOM_FAIL,
  SERVER_URL,
} from "./type";

export const checkRoomId = (room_id) => (dispatch) => {
  dispatch({
    type: CHECK_ROOM_ID_SENT,
  });
  fetch(`${SERVER_URL}/rooms/checkId/${room_id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Request failed");
      }
      return res.json();
    })
    .then((data) => {
      dispatch({
        type: CHECK_ROOM_ID_RCV,
        payload: data,
      });
    })
    .catch((error) => {
      dispatch({
        type: CHECK_ROOM_ID_FAIL,
        payload: { error },
      });
    });
};

export const getNewRoom = (room_id) => (dispatch) => {
  dispatch({
    type: CREATE_NEW_ROOM_SENT,
  });
  fetch(`${SERVER_URL}/rooms/checkId/${room_id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Request failed");
      }
      return res.json();
    })
    .then((data) => {
      dispatch({
        type: CREATE_NEW_ROOM_RCV,
        payload: data,
      });
    })
    .catch((error) => {
      dispatch({
        type: CREATE_NEW_ROOM_FAIL,
        payload: { error },
      });
    });
};
