import { createSlice } from "@reduxjs/toolkit";

// Token expiration check
const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true; // treat invalid token as expired
  }
};

// Default (initial) state
const storedToken = localStorage.getItem("token");
const initialToken =
  storedToken && !isTokenExpired(storedToken) ? storedToken : null;

if (!initialToken) {
  localStorage.removeItem("token");
}

const initialState = {
  user: null,
  token: initialToken,
};

// Slice action and reducer
export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
      state.token = action.payload;
    },
  },
});

// Export the action
export const { setToken, setUser } = authSlice.actions;

// Export the state/reducers
export default authSlice.reducer;

/* 
    Analogy in useState code
*/
// const [user, setUser] = useState(null);
// const [token, setToken] = useState(localStorage.getItem("token") || null);
