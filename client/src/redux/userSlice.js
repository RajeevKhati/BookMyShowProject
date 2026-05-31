import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const bootstrapSession = createAsyncThunk(
  "user/bootstrapSession",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue({ code: "NO_TOKEN" });
    }

    try {
      const { GetCurrentUser } = await import("../api/user");
      const payload = await GetCurrentUser();
      if (payload?.success && payload?.data != null) {
        return payload.data;
      }
      return rejectWithValue({
        code: "INVALID_SESSION",
        message:
          payload?.message ||
          "Unable to restore your session. Please sign in again.",
      });
    } catch (error) {
      return rejectWithValue({
        code: "INVALID_SESSION",
        message:
          error instanceof Error ? error.message : "Please sign in again.",
      });
    }
  },
  {
    condition: (_, { getState }) => {
      const { user, sessionStatus } = getState().user;
      if (sessionStatus === "loading") return false;
      if (sessionStatus === "ready" && user) return false;
      return true;
    },
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    sessionStatus: "idle",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.sessionStatus = action.payload ? "ready" : "idle";
    },
    clearSession: (state) => {
      state.user = null;
      state.sessionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.sessionStatus = "loading";
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sessionStatus = "ready";
      })
      .addCase(bootstrapSession.rejected, (state, action) => {
        state.user = null;
        state.sessionStatus =
          action.payload?.code === "NO_TOKEN" ? "idle" : "failed";
      });
  },
});

export const { setUser, clearSession } = userSlice.actions;
export default userSlice.reducer;
