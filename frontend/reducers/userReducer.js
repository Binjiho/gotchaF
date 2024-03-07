const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        ...action.payload,
      };
    case "LOGOUT_USER":
      return {};
    default:
      return state;
  }
};

export default userReducer;
