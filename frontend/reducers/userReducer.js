const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        ...action.payload,
      };
    case "GET_USER":
      return state.user;
    case "LOGOUT_USER":
      return {};
    default:
      return state;
  }
};

export default userReducer;
