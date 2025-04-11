import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { store } from "../store";
import { UserRole, users } from "@/lib/constants";
import { toast } from "sonner";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface User {
  id: string;
  username: string;
  password: string;
  roleId: string;
  affiliateLink: string;
  firstName: string | null;
  lastName: string | null;
  mobileNumber: string | null;
  bankName: string | null;
  accountNumber: string | null;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Define the state type
interface AuthState {
  authLoading: boolean;
  role: string | null;
  username: string | null;
  user: User | null;
}

// Initial state
const initialState: AuthState = {
  authLoading: true,
  role: UserRole?.DEFAULT ?? "defaultOperator",
  username: null,
  user: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUsername: (state) => {
      state.username = null;
    },
    clearRole: (state) => {
      state.role = null;
    },
    clearAuthLoading: (state) => {
      state.authLoading = false;
    },
  },
});

export const {
  setRole,
  clearRole,
  setUsername,
  clearUsername,
  setAuthLoading,
  setUser,
  clearAuthLoading,
} = authSlice.actions;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
// Thunk
export const login =
  (username: string, password: string) =>
  async (dispatch: typeof store.dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      console.log("Login response:", response.data);

      if (response.status === 200) {
        if (response.data.code === "1002") {
          const { user, token } = response.data.data;

          // Dispatch to Redux Store
          dispatch(setUsername(user.username));
          dispatch(setRole(user.role.name));
          dispatch(setUser(user));

          // Save credentials to localStorage
          localStorage.setItem("username", user.username);
          localStorage.setItem("role", user.role.name);
          localStorage.setItem("token", token); // Store JWT Token
          //  for auth
          // Save user to localStorage
          localStorage.setItem("user", JSON.stringify(user));

          toast(response.data.message || "Login successful");

          return true;
        } else {
          toast(response.data.message || "Login failed");
          return false;
        }
      } else {
        toast(response.data.message || "Login failed");
        return false;
      }
    } catch (error) {
      toast("Login failed:", error.response?.data || error.message);
      return false;
    }
  };

export default authSlice.reducer;
