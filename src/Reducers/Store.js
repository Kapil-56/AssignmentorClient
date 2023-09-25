// store.js
import { combineReducers } from "redux";
import { dataReducer } from "./DataReducer";
import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./UserReducer";
import { UserPostsReducer } from "./UserPosts";
import { UserConvoList } from "./UserConvoList";


const rootReducer = combineReducers({
  data: dataReducer,
  user: reducer,
  userPosts: UserPostsReducer,
  userConvoList: UserConvoList,

});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
