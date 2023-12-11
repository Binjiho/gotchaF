export const setUser = user => ({
  type: "SET_USER",
  payload: user,
});

export const getUser = () => ({
  type: "GET_USER",
});

export const logoutUser = () => ({
  type: "LOGOUT_USER",
});
