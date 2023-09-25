// actions.js
export const setData = (data) => ({
  type: "SET_DATA",
  payload: data,
});

// reducers.js
const initialState = {
  data: [],
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};
