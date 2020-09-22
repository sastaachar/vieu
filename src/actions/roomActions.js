// used for stable unique keys
import { v4 as uuidv4 } from "uuid";

import {
  SERVER_URL,
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
} from "./type";

export const getNewRoom = (cb) => (dispatch) => {
  dispatch({
    type: CREATE_NEW_ROOM_SENT,
  });
  fetch(`${SERVER_URL}/rooms`)
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
      if (cb) cb(data);
    })
    .catch((error) => {
      dispatch({
        type: CREATE_NEW_ROOM_FAIL,
        payload: error,
      });
    });
};

export const checkRoom = ({ socket, room_id }, cb) => (dispatch) => {
  dispatch({ type: CHECK_ROOM_ID_SENT });
  try {
    socket.emit("GET_ROOM", { room_id }, (data, error) => {
      if (error) {
        console.log(error);
        dispatch({ type: CHECK_ROOM_ID_RCV, payload: { exists: false } });
      } else {
        // we need stable keys for render
        const members = data.members.map((userName) => ({
          pseudoId: uuidv4(),
          userName,
        }));

        dispatch({
          type: CHECK_ROOM_ID_RCV,
          payload: { exists: true, members, room_id },
        });
        if (cb) cb(data);
      }
    });
  } catch (err) {
    dispatch({ type: CHECK_ROOM_ID_FAIL });
  }
};

export const joinRoom = ({ socket, data }, cb) => (dispatch) => {
  dispatch({ type: JOIN_ROOM_SENT });
  try {
    // data has roomid , userName
    socket.emit("JOIN_ROOM", data, (rcvData, error) => {
      if (error) {
        dispatch({ type: JOIN_ROOM_FAIL, payload: error });
        if (cb) cb(false);
      } else {
        const { userName } = data;
        dispatch({
          type: JOIN_ROOM_SUCESS,
          payload: {
            memberData: rcvData,
            userData: { user_id: socket.id, userName },
          },
        });
        if (cb) cb(true);
      }
    });
  } catch (err) {
    dispatch({ type: JOIN_ROOM_ERROR, error: err.message });
  }
};
