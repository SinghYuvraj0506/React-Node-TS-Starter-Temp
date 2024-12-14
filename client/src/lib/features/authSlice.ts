import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { loginFormSchema, registerFormSchema } from "../schemas";
import { z } from "zod";
import { axiosServices } from "../utils";
import { toast } from "@/hooks/use-toast";

interface authState {
  user: any;
  loading: boolean;
  error: null | string
}

const initialState: authState = {
  user: null,
  loading: false,
  error:null
};

const name = "auth";
const extraActions = extraActionsFunction();

export const authSlice = createSlice({
  name,
  initialState,
  reducers:{
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => extraReducersFunction(builder)
});

function extraActionsFunction() {
  return {
    registerUser: registerUser(),
    loginUser: loginUser()
  };

  // create api -------------------------------------
  function registerUser() {
    return createAsyncThunk(
      `${name}/registerUser`,
      async (data: z.infer<typeof registerFormSchema>, {rejectWithValue}) => {
        try {
          const response = await axiosServices.post(`/auth/register`, data);
          return response.data;
        } catch (err: any) {
          return rejectWithValue(err?.response?.data?.message || "Something went wrong");
        }
      }
    );
  }

  function loginUser() {
    return createAsyncThunk(
      `${name}/loginUser`,
      async (data: z.infer<typeof loginFormSchema>, {rejectWithValue}) => {
        try {
          const response = await axiosServices.post(`/auth/login`, data);
          return response.data;
        } catch (err: any) {
          return rejectWithValue(err?.response?.data?.message || "Something went wrong");
        }
      }
    );
  }
}

function extraReducersFunction(builder:ActionReducerMapBuilder<authState>) {
  registerUserReducer(builder);
  loginUserReducer(builder);

  function registerUserReducer(builder:ActionReducerMapBuilder<authState>) {
    builder
        .addCase(extraActions.registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(extraActions.registerUser.fulfilled, (state) => {
          state.loading = false;
          state.error = null;
        })
        .addCase(extraActions.registerUser.rejected, (state, action:any) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  }

  function loginUserReducer(builder:ActionReducerMapBuilder<authState>) {
    builder
        .addCase(extraActions.loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(extraActions.loginUser.fulfilled, (state) => {
          state.loading = false;
          state.error = null;
        })
        .addCase(extraActions.loginUser.rejected, (state, action:any) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  }
}


export const authActions = { ...authSlice.actions, ...extraActions };

export default authSlice.reducer;