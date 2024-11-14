import React, { useEffect, useState } from 'react';
import api from '../../../api';

const StudentBookedSessions = () => {
    const [bookedSessions, setBookedSessions] = useState({
        all_sessions: [],
        grouped_sessions: {
            pending: [],
            confirmed: [],
            completed: []
        }
    });
    const [error, setError] = useState(null);

    // Fetch student-booked sessions and update state
    const fetchBookedSessions = async () => {
        try {
            const response = await api.get('/api/users/student-booked-sessions/');
            console.log(response.data)
            setBookedSessions(response.data);
            setError(null);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to load booked sessions.";
            setError(errorMessage);
            console.error('Error fetching booked sessions:', error);
        }
    };

    // Cancel/Delete a booked session
    const handleDeleteSession = async (sessionId) => {
        try {
            await api.delete(`/api/users/student-booked-sessions/${sessionId}/`);
            fetchBookedSessions(); // Refresh sessions after deletion
        } catch (error) {
            console.error('Error canceling session:', error);
            setError("Failed to cancel session.");
        }
    };

    // Fetch booked sessions on component mount
    useEffect(() => {
        fetchBookedSessions();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Your Booked Sessions</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="session-section">
                <h2 className="text-xl font-semibold mb-4">Pending Sessions ({bookedSessions.grouped_sessions.pending.length})</h2>
                {bookedSessions.grouped_sessions.pending.map(session => (
                    <SessionCard 
                        key={session.id} 
                        session={session}
                        onDelete={() => handleDeleteSession(session.id)}
                        allowCancel={true}
                    />
                ))}
            </div>

            <div className="session-section mt-6">
                <h2 className="text-xl font-semibold mb-4">Confirmed Sessions ({bookedSessions.grouped_sessions.confirmed.length})</h2>
                {bookedSessions.grouped_sessions.confirmed.map(session => (
                    <SessionCard 
                        key={session.id} 
                        session={session}
                        onDelete={() => handleDeleteSession(session.id)}
                        allowCancel={true}
                    />
                ))}
            </div>

            <div className="session-section mt-6">
                <h2 className="text-xl font-semibold mb-4">Completed Sessions ({bookedSessions.grouped_sessions.completed.length})</h2>
                {bookedSessions.grouped_sessions.completed.map(session => (
                    <SessionCard 
                        key={session.id} 
                        session={session}
                        allowCancel={false}
                    />
                ))}
            </div>
        </div>
    );
};

// Updated SessionCard component to display session link
const SessionCard = ({ session, onDelete, allowCancel }) => {
    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl flex justify-between items-center space-x-4 mb-4">
            <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">👤 Tutor: <span className="text-gray-900">{session.tutor_name}</span></h3>
                <p className="text-gray-700">📚 Subject: <span className="font-medium text-gray-900">{session.subject}</span></p>
                <p className="text-gray-700">📅 Date: <span className="font-medium text-gray-900">{new Date(session.date).toLocaleString()}</span></p>
                <p className="text-gray-700">🔖 Status: <span className={`font-medium ${session.status === 'Pending' ? 'text-yellow-500' : session.status === 'Confirmed' ? 'text-green-500' : 'text-gray-500'}`}>
                    {session.status}
                </span></p>
                <p className="text-gray-700">📅 Booked on: <span className="font-medium text-gray-900">{new Date(session.booking_date).toLocaleString()}</span></p>
                
                {/* Display session link for confirmed sessions */}
                {session.status === 'Confirmed' && session.session_link && (
                    <div className="mt-2">
                        <p className="text-gray-700">🔗 Session Link: 
                            <a 
                                href={session.session_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                                Join Session
                            </a>
                        </p>
                    </div>
                )}
            </div>
            
            {allowCancel && (
                <div className="flex flex-col items-end">
                    <button
                        onClick={onDelete}
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-75 transition ease-in-out duration-300"
                    >
                        Cancel Session
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentBookedSessions;