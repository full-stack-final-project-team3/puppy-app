import React from 'react';
import {useDispatch} from "react-redux";
import {userEditActions} from "../../../store/user/UserEditSlice";


const UserEdit = () => {


    const dispatch = useDispatch();
    const clearEditMode = e => {
        dispatch(userEditActions.clearMode())
        dispatch(userEditActions.clearUserEditMode())
    }

    return (
        <div>
            userEditMode!!!
            <button onClick={clearEditMode}>완료</button>
        </div>
    );
};

export default UserEdit;