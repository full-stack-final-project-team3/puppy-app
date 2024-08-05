// signUpSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  nickname: '',
  password: '',
  address: '',
  phoneNumber: '',
  step: 1,
};

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setNickname(state, action) {
      state.nickname = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    setStep(state, action) {
      state.step = action.payload;
    },
  },
});

export const {
  setEmail,
  setNickname,
  setPassword,
  setAddress,
  setPhoneNumber,
  setStep,
} = signUpSlice.actions;

export default signUpSlice.reducer;
