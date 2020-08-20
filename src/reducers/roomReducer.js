const initialState = {
  loading: false,
  error: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        userDataLoading: true,
      };
    default:
      return state;
  }
}
