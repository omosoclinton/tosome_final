import { useState, useEffect } from "react";
import { INITIAL_STATE, INITIAL_USER_STATE, INITIAL_PROFILE_STATE } from "../reducers/tutorReducer";
import api from "../../../api";


const useProfileData = () => {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [profile, setProfile] = useState(INITIAL_STATE);
  const[userProfile, setUserProfile] = useState(INITIAL_PROFILE_STATE)

  useEffect(() => {
    getUser();
    getTutorProfile();
    getProfile()
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/api/users/get-user/");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const getTutorProfile = async () => {
    try {
      const res = await api.get("/api/users/get-tutor-profile/");
      if (res.status === 200) {
        setProfile(res.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };

    const getProfile = async () => {
        try {
            const res = await api.get("/api/users/profile/")
            if (res.status === 200) {
                setUserProfile(res.data);
            } else {
                setUserProfile(null);
            }
        } catch (error) {
            console.error("Error fetching user profile")
        }
    }

  return { user, profile, userProfile,setProfile };
};

export default useProfileData;