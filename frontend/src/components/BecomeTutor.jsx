import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../../api';
import PageOne from './tutorRegistration/PageOne';
import PageTwo from './tutorRegistration/PageTwo';

const BecomeTutor = () => {
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        subjects: '',
        qualifications: '',
        experience: '',
        user_type: 'tutor',
    });
    const nextStep = () => {
        setStep(step + 1)
    }
    const prevStep = () => {
        setStep(step - 1)
    }

    const handleChange = async (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        // Handle form submission logic (e.g., sending to backend)
        console.log('Form Data:', formData);
        try {
            const response = await api.post('/api/users/register-tutor/', formData)
            console.log('Form submitted', response.data)
            navigate('/login')
        } catch (error) {
            setError('Form was not submitted')
            console.error('Error submitting form', error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            {step === 1 && (
                <PageOne formData={formData} handleChange={handleChange} nextStep={nextStep} />
            )}
            {step === 2 && (
                <PageTwo formData={formData} handleChange={handleChange} prevStep={prevStep} handleSubmit={handleSubmit} setLoading loading />
            )}
        </>
    );
};

export default BecomeTutor;


// If you need options use this

// <div className="mb-4">
//   <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">Subject</label>
//   <select
//     id="subject"
//     name="subject"
//     value={formData.subject}
//     onChange={handleChange}
//     className="border p-2 w-full rounded"
//   >
//     <option value="">Select a subject</option>
//     <option value="Math">Math</option>
//     <option value="Science">Science</option>
//     {/* Add more subjects */}
//   </select>
// </div>


