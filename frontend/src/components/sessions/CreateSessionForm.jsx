import React, { useState, useEffect } from 'react';
import api from '../../../api';
import Modal from '../Modal';

const CreateSessionForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await api.get('/api/users/tutor-profile/');
                setSubjectOptions(response.data.subjects.split(', '));
            } catch (error) {
                console.error("Failed to fetch subjects", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/users/create-session/', {
                subject,
                date
            });
            if (response.status === 201) {
                setMessage('Session created successfully!');
                setSubject('');
                setDate('');
            }
        } catch (error) {
            setMessage('Failed to create session. Please try again.');
            console.error(error);
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-gray-600 hover:text-blue-600"
            >
                Create new session
            </button>

            <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Create a New Session</h2>
                    {message && <p className="text-green-500 mb-4">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Subject</label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjectOptions.map((subj) => (
                                    <option key={subj} value={subj}>{subj}</option>
                                ))}
                            </select>
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
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                            Create Session
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default CreateSessionForm;
