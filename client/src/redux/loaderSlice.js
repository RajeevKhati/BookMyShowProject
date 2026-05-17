import { createSlice } from "@reduxjs/toolkit";

/**
 * Axios interceptors increment/decrement pendingRequests.
 * Loader overlay shows when pendingRequests > 0.
 */
const loaderSlice = createSlice({
  name: "loaders",
  initialState: {
    pendingRequests: 0,
  },
  reducers: {
    showLoading: (state) => {
      state.pendingRequests += 1;
    },
    hideLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
  },
});

export const { showLoading, hideLoading } = loaderSlice.actions;

/** Derive loading flag for UI (ref-count safe). */
export const selectIsGlobalLoading = (state) =>
  state.loader.pendingRequests > 0;

export default loaderSlice.reducer;
