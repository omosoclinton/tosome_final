import { createContext, useReducer, useRef } from "react";
//import { INITIAL_STATE } from "../reducers/tutorReducer";
//import { useReducer } from "react";
//import { tutorReducer } from "../reducers/tutorReducer";
//import api from "../../api";

export const ProfileContext = createContext({});
export const TutorProfileContext = createContext({});

export const useMyContext = () => {
    const contextRef = useRef(null)
    return contextRef
  }

// {export const TutorProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(tutorReducer, INITIAL_STATE)

//     const getTutor = async () => {
//         try {
//             const res = await api.get("/api/users/get-tutor/");
//             dispatch({
//                 type: 'SET_TUTOR',
//                 payload: { name: res.data.name, value: res.data.value },
//             })
//             console.log('Tutor data:', res.data);
//         } catch (error) {
//             alert('Error fetching tutor profile')
//             console.error(error)
//         };
//     };
// };}