
import React from "react";

export const INITIAL_STATE = {
    subjects: '',
    qualifications: '',
    experience: '',
    rating:'',
    status:'',
};

export const INITIAL_USER_STATE = {
    first_name: "", 
    last_name: "", 
    username: "", 
    email: "",
    user_type:'', 
}

export const INITIAL_PROFILE_STATE = {
    user:'',
    image:'',
    about:'',
    phone_number:'',
    linked_in:'',
    github:'',
}
export const tutorReducer = (state, action) => {
    switch (action.type) {
        case "SET_TUTOR":
            console.log("SET_TUTOR", action.payload)
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state;
    }
};