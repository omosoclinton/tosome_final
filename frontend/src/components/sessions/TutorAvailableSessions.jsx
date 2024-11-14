import React, { useEffect, useState } from 'react';
import api from '../../../api';

const TutorAvailableSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await api.get('/api/users/create-session/');
            const available = response.data.filter(session => !session.is_booked)
            setSessions(available);
        } catch (error) {
            setError("Failed to load sessions.");
            console.error(error);
        }
    };

    const openUpdateModal = (session) => {
        setSelectedSession(session.id);
        setSubject(session.subject);
        setDate(session.date);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSession = async () => {
        try {
            const updatedData = { subject, date };
            await api.put(`/api/users/available-sessions/${selectedSession}/update/`, updatedData);
            setIsUpdateModalOpen(false);
            fetchSessions();
        } catch (error) {
            console.error("Failed to update session", error);
        }
    };
    
    const handleDelete = async (sessionId) => {
        try {
            await api.delete(`/api/users/available-sessions/${sessionId}/delete/`);
            setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
        } catch (error) {
            console.error("Failed to delete session:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Your Available Sessions</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {sessions.length > 0 ? (
                <div className="space-y-6">
                    {sessions.map((session) => (
                        <div 
                            key={session.id} 
                            className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl flex justify-between items-center space-x-4"
                        >
                            <div className="flex flex-col space-y-2">
                                <h3 className="text-lg font-semibold text-gray-700">📚 Subject: <span className="text-gray-900">{session.subject}</span></h3>
                                <p className="text-gray-700">📅 Date: <span className="font-medium text-gray-900">{new Date(session.date).toLocaleString()}</span></p>
                                <p className="text-gray-700">🔖 Status: <span className="font-medium text-green-500">{session.is_booked ? 'Booked' : 'Available'}</span></p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => openUpdateModal(session)}
                                    className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition ease-in-out duration-300"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition ease-in-out duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center mt-10">No available sessions created.</p>
            )}

            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-4">Update Session</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateSession();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Date and Time</label>
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded mt-2 hover:bg-gray-600 w-full"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorAvailableSessions;
