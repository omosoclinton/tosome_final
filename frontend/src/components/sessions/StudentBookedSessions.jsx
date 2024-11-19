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
            await api.delete(`/api/users/student-booked-sessions/${sessionId}/delete/`);
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
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5); // Default rating
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedReview, setSubmittedReview] = useState(null);
    const [submittedRating, setSubmittedRating] = useState(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
    const [feedbackError, setFeedbackError] = useState(null);

    // Fetch existing feedback when component mounts
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await api.get(`/api/users/sessions/${session.id}/get-feedback/`);
                console.log(response.data)
                setSubmittedReview(response.data.review);
                setSubmittedRating(response.data.rating);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // No feedback found, this is expected behavior
                    setSubmittedReview(null);
                    setSubmittedRating(null);
                } else {
                    console.error('Error fetching feedback:', error);
                    setFeedbackError('Could not load feedback');
                }
            } finally {
                setIsLoadingFeedback(false);
            }
        };

        fetchFeedback();
    }, [session.id]);

    // Handle review form submission
    const handleReviewSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await api.post(`/api/users/sessions/${session.id}/feedback/`, {
                rating,
                review: reviewText,
            });

            // Update state with the submitted review and rating
            setSubmittedReview(response.data.review);
            setSubmittedRating(response.data.rating);
            setShowReviewForm(false);
            setReviewText('');
            setRating(5);
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                
                {/* Show review if available or form for completed sessions */}
                {session.status === 'Completed' && (
                    <>
                        {isLoadingFeedback ? (
                            <p className="text-gray-500">Loading feedback...</p>
                        ) : feedbackError ? (
                            <p className="text-red-500">{feedbackError}</p>
                        ) : submittedReview && submittedRating? (
                            <div className="mt-2">
                                <p className="text-gray-700">🌟 Your Rating: <span className="font-medium text-gray-900">{submittedRating} / 5</span></p>
                                <p className="text-gray-700">📝 Your Review: <span className="text-gray-900">{submittedReview}</span></p>
                            </div>
                        ) : !showReviewForm ? (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="mt-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition ease-in-out duration-300"
                            >
                                Leave Review
                            </button>
                        ) : (
                            <div className="mt-2">
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Write your review..."
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                                />
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={isSubmitting}
                                    className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition ease-in-out duration-300"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        )}
                    </>
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