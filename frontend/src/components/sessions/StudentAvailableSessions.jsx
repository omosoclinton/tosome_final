import React, { useEffect, useState } from 'react';
import api from '../../../api';

const StudentAvailableSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchAvailableSessions();
    }, []);

    const fetchAvailableSessions = async () => {
        try {
            const response = await api.get('/api/users/all-sessions/'); // Use the new endpoint
            console.log(response.data)
            setSessions(response.data);
        } catch (error) {
            setError("Failed to load available sessions.");
            console.error(error);
        }
    };

    const handleBookSession = async (sessionId) => {
        try {
            await api.post('/api/users/booked-sessions/', { available_session: sessionId });
            setSuccessMessage("Session booked successfully!");
            fetchAvailableSessions();  // Refresh sessions to reflect changes
        } catch (error) {
            setError("Failed to book session.");
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Available Sessions</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

            {sessions.length > 0 ? (
                <div className="space-y-6">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl flex justify-between items-center space-x-4"
                        >
                            <div className="flex flex-col space-y-2">
                            <h3 className="text-lg font-semibold text-gray-700">👤 Tutor: <span className="text-gray-900">{session.tutor_name}</span></h3>
                                <h3 className="text-xl font-semibold text-gray-700">📚 Subject: <span className="text-gray-900">{session.subject}</span></h3>
                                <p className="text-gray-700">📅 Date: <span className="font-medium text-gray-900">{new Date(session.date).toLocaleString()}</span></p>
                                <p className="text-gray-700">🔖 Status: <span className={`font-medium ${session.is_booked ? 'text-red-500' : 'text-green-500'}`}>
                                    {session.is_booked ? 'Booked' : 'Available'}
                                </span></p>
                            </div>
                            {!session.is_booked && (
                                <button
                                    onClick={() => handleBookSession(session.id)}
                                    className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 transition ease-in-out duration-300"
                                >
                                    Book
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center mt-10">No sessions available at the moment.</p>
            )}
        </div>

    );
};

export default StudentAvailableSessions;
