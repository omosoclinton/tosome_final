import React from "react";
import WelcomeSection from "../components/WelcomeSection";
import useProfileData from "../components/hooks/useProfileData";
import TutorAvailableSessions from "../components/sessions/TutorAvailableSessions";
import StudentBookedSessions from "../components/sessions/StudentBookedSessions";
import StudentAvailableSessions from "../components/sessions/StudentAvailableSessions";
import TutorBookedSessions from "../components/sessions/TutorBookedSessions";


const Dashboard = () => {
    const { user } = useProfileData()
    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-6">
            <WelcomeSection />

            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {user.user_type === 'tutor' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <TutorAvailableSessions />
                    </div>
                    <div>
                        <TutorBookedSessions />
                    </div>
                </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <StudentAvailableSessions />
                        </div>
                        <div>
                            <StudentBookedSessions />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard