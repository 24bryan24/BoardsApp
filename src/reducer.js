export const initialState = {
    user: null,
    isMobile: false,
    showSidebarChat: null,
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_MOBILE: "SET_MOBILE",
    SET_SIDEBARCHAT: "SET_SIDEBARCHAT"
};

const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
      case actionTypes.SET_USER:
        return {
          ...state,
          user: action.user,
        };
      case actionTypes.SET_MOBILE:
        return {
          ...state,
          isMobile: action.isMobile,
        };
      case actionTypes.SET_SIDEBARCHAT:
        return {
          ...state,
          showSidebarChat: !state.showSidebarChat,
        };
      default:
        return state;
    }
};

export default reducer;