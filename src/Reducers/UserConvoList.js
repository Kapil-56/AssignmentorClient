//create a redux reducer for the user's conversation list
export const initialState = [];

//create action that saves the user's conversation list
export const setUserConvoList = (convoList) => ({
  type: "USERCONVOLIST",
  payload: convoList,
});

//create an action that updates the user's conversation list
export const updateUserConvoList = (convo) => ({
  type: "UPDATEUSERCONVOLIST",
  payload: convo,
});

//create a reducer that saves the user's conversation list
export const UserConvoList = (state = initialState, action) => {
  switch (action.type) {
    case "USERCONVOLIST":
      return action.payload;
    default:
      return state;
  }
};

//create a reducer that updates the user's conversation list
export const UpdateUserConvoList = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATEUSERCONVOLIST":
      return [...state, action.payload];
    default:
      return state;
  }
};
