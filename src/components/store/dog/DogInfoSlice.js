import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    dogInfo: {},

}

const dogSlice = createSlice({
    name: 'dog',
    initialState,
    reducers: {
        setDogInfo: (state, action) => { // 강아지 정보 저장
            state.dogInfo = action.payload;
            let parse = JSON.parse(state.dogInfo);
            console.log(parse)

        }
    }
})

export const userActions = dogSlice.actions;
export default dogSlice.reducer;