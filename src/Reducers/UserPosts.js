//create an action that save posts uploaded by user
export const setUserPosts = (posts) => ({
  type: "USER_POSTS",
  payload: posts,
});




//create a reducer that save posts uploaded by user
const initialState = [];

export const UserPostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_POSTS":
      return action.payload;
    default:
      return state;
  }
};
