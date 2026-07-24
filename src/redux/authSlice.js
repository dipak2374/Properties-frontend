import { createSlice } from '@reduxjs/toolkit';

let persistedAuth = null;

if (typeof window !== 'undefined') {
  try {
    persistedAuth = JSON.parse(window.localStorage.getItem('propertyhub-auth') || 'null');
  } catch {
    persistedAuth = null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedAuth?.user ?? null,
    token: persistedAuth?.token ?? null,
  },
  reducers: {
    setAuth(state, action) {
      const nextAuth = action.payload || {};
      state.user = nextAuth.user ?? null;
      state.token = nextAuth.token ?? null;

      if (typeof window !== 'undefined') {
        if (state.user && state.token) {
          window.localStorage.setItem('propertyhub-auth', JSON.stringify({ user: state.user, token: state.token }));
        } else {
          window.localStorage.removeItem('propertyhub-auth');
        }
      }
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('propertyhub-auth');
      }
    },
  },
});

export const { setAuth, setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
