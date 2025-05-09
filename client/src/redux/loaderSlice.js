import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loaders", // Name of the slice, used for action type prefixes
  initialState: {
    loading: false, // Initial state
  },
  reducers: {
    // Reducer to show loading spinner
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
