import {
  createSlice,
  createAsyncThunk,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { loginFormSchema, registerFormSchema } from "../schemas";
import { z } from "zod";
import { axiosServices } from "../utils";
import { User } from "../types";

interface authState {
  user: User | null;
  loading: boolean;
  error: null | string;
}

const initialState: authState = {
  user: null,
  loading: false,
  error: null,
};

const name = "auth";
const extraActions = extraActionsFunction();

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => extraReducersFunction(builder),
});

function extraActionsFunction() {
  return {
    registerUser: registerUser(),
    loginUser: loginUser(),
    getUser: getUser(),
  };

  // create api -------------------------------------
  function registerUser() {
    return createAsyncThunk(
      `${name}/registerUser`,
      async (data: z.infer<typeof registerFormSchema>, { rejectWithValue }) => {
        try {
          const response = await axiosServices.post(`/auth/register`, data);
          return response.data;
        } catch (err: any) {
          return rejectWithValue(
            err?.response?.data?.message || "Something went wrong"
          );
        }
      }
    );
  }

  function loginUser() {
    return createAsyncThunk(
      `${name}/loginUser`,
      async (data: z.infer<typeof loginFormSchema>, { rejectWithValue }) => {
        try {
          const response = await axiosServices.post(`/auth/login`, data);
          return response.data;
        } catch (err: any) {
          return rejectWithValue(
            err?.response?.data?.message || "Something went wrong"
          );
        }
      }
    );
  }

  function getUser() {
    return createAsyncThunk(`${name}/getUser`, async (data:null,{rejectWithValue}) => {
      try {
        const response = await axiosServices.get(`/auth/me`);
        return response.data;
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data?.message || "Something went wrong"
        );
      }
    });
  }
}

function extraReducersFunction(builder: ActionReducerMapBuilder<authState>) {
  registerUserReducer(builder);
  loginUserReducer(builder);
  getUserReducer(builder)

  function registerUserReducer(builder: ActionReducerMapBuilder<authState>) {
    builder
      .addCase(extraActions.registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extraActions.registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(extraActions.registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }

  function loginUserReducer(builder: ActionReducerMapBuilder<authState>) {
    builder
      .addCase(extraActions.loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extraActions.loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(extraActions.loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }

  function getUserReducer(builder: ActionReducerMapBuilder<authState>) {
    builder
      .addCase(extraActions.getUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(extraActions.getUser.fulfilled, (state,action) => {
        state.loading = false;
        state.user = action.payload.data
        state.error = null;
      })
      .addCase(extraActions.getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        // state.error = action.payload as string;
      });
  }
}

export const authActions = { ...authSlice.actions, ...extraActions };

export default authSlice.reducer;
