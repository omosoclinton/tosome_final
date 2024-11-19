import React, { useEffect, useState } from 'react';
import api from '../../../api';

const TutorBookedSessions = () => {
    const [bookedSessions, setBookedSessions] = useState({
        all_sessions: [],
        grouped_sessions: {
            pending: [],
            confirmed: [],
            completed: []
        }
    });
    const [error, setError] = useState(null);

    // Fetch tutor-booked sessions and update state
    const fetchBookedSessions = async () => {
        try {
            const response = await api.get('/api/users/tutor-booked-sessions/');
            console.log(response.data);
            setBookedSessions(response.data);
            setError(null);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to load booked sessions.";
            setError(errorMessage);
            console.error('Error fetching booked sessions:', error);
        }
    };

    // Confirm session by updating its status to "Confirmed"
    const handleConfirmSession = async (sessionId) => {
        try {
            await api.patch(`/api/users/confirm-booked-session/${sessionId}/`);
            fetchBookedSessions(); // Refresh sessions after updating
        } catch (error) {
            console.error('Error confirming session:', error);
            setError("Failed to confirm session.");
        }
    };

    // Complete session by updating its status to "Completed"
    const handleCompleteSession = async (sessionId) => {
        try {
            await api.patch(`/api/users/sessions/${sessionId}/complete/`);
            fetchBookedSessions(); // Refresh sessions after updating
        } catch (error) {
            console.error('Error marking session as completed:', error);
            setError("Failed to mark session as completed.");
        }
    };

    // Add session link for confirmed sessions
    const handleAddSessionLink = async (sessionId, link) => {
        try {
            await api.patch(`/api/users/sessions/${sessionId}/add-link/`, { session_link: link });
            fetchBookedSessions(); // Refresh sessions after updating
        } catch (error) {
            console.error('Error adding session link:', error);
            setError("Failed to add session link.");
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
                        onConfirm={() => handleConfirmSession(session.id)}
                    />
                ))}
            </div>

            <div className="session-section mt-6">
                <h2 className="text-xl font-semibold mb-4">Confirmed Sessions ({bookedSessions.grouped_sessions.confirmed.length})</h2>
                {bookedSessions.grouped_sessions.confirmed.map(session => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onComplete={() => handleCompleteSession(session.id)}
                        onAddLink={(link) => handleAddSessionLink(session.id, link)} // Pass link function to SessionCard
                    />
                ))}
            </div>

            <div className="session-section mt-6">
                <h2 className="text-xl font-semibold mb-4">Completed Sessions ({bookedSessions.grouped_sessions.completed.length})</h2>
                {bookedSessions.grouped_sessions.completed.map(session => (
                    <SessionCard
                        key={session.id}
                        session={session}
                    />
                ))}
            </div>
        </div>
    );
};

// SessionCard component for displaying individual sessions
const SessionCard = ({ session, onConfirm, onComplete, onAddLink }) => {
    const [link, setLink] = useState(session.session_link || '');

    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl flex justify-between items-center space-x-4 mb-4">
            <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">👤 Student: <span className="text-gray-900">{session.student_name}</span></h3>
                <p className="text-gray-700">📚 Subject: <span className="font-medium text-gray-900">{session.subject}</span></p>
                <p className="text-gray-700">📅 Date: <span className="font-medium text-gray-900">{new Date(session.date).toLocaleString()}</span></p>
                <p className="text-gray-700">🔖 Status: <span className={`font-medium ${session.status === 'Pending' ? 'text-yellow-500' : session.status === 'Confirmed' ? 'text-green-500' : 'text-gray-500'}`}>
                    {session.status}
                </span></p>
                <p className="text-gray-700">📅 Booked on: <span className="font-medium text-gray-900">{new Date(session.booking_date).toLocaleString()}</span></p>

                {/* Show feedback if the session is completed and has feedback */}
                {session.status === 'Completed' && session.feedback && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-700">🌟 Student Feedback</h4>
                        <p className="text-gray-700">Rating: <span className="font-medium text-yellow-500">{session.feedback.rating} / 5</span></p>
                        <p className="text-gray-700">Review: <span className="font-medium">{session.feedback.review}</span></p>
                    </div>
                )}

                {/* Show link input and save button only for confirmed sessions */}
                {session.status === 'Confirmed' && (
                    <div className="flex items-center space-x-2 mt-4">
                        {session.session_link === undefined || session.session_link === null ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Add session link"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    onClick={() => onAddLink(link)}
                                    className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 transition ease-in-out duration-300"
                                >
                                    Save Link
                                </button>
                            </>
                        ) : (
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
                )}
            </div>

            {/* Buttons for Confirm or Complete actions */}
            {session.status === 'Pending' && onConfirm && (
                <button
                    onClick={onConfirm}
                    className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 transition ease-in-out duration-300"
                >
                    Confirm Session
                </button>
            )}

            {session.status === 'Confirmed' && onComplete && (
                <button
                    onClick={onComplete}
                    className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-75 transition ease-in-out duration-300"
                >
                    Mark as Completed
                </button>
            )}
        </div>
    );
};


export default TutorBookedSessions;
