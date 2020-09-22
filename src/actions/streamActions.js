import { CHANGE_STREAM_STATE } from "./type";

export const updateStreamState = (newState) => (dispatch) => {
  // the given cb will be called once the conn is established
  dispatch({ type: CHANGE_STREAM_STATE, payload: newState });
};
