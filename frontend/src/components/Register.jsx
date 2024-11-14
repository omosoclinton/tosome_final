import React from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../assets/images/tosome-high-resolution-logo.svg'
import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom";


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        user_type:'student',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        setLoading(true)
        console.log(formData)
        e.preventDefault();

        if (formData.password != formData.password2) {
            setError("Passwords don't match");
            return;
        }
        try {
            const response = await api.post('/api/users/student-register/', formData);
            console.log('User registered: ', response.data);

            navigate('/login');
        } catch (error) {
            setError('Signup failed. Please try again');
            console.error('Error during signup: ', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
            <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
                <div className="text-center mb-12">
                    <a href="#">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-40 inline-block"
                        />
                    </a>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">First Name</label>
                            <input
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
                            <input
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Username</label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Email</label>
                            <input
                                name="email"
                                type="text"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                                placeholder="Enter email"
                            />
                        </div>

                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                                placeholder="Enter password"
                            />
                        </div>

                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
                            <input
                                name="password2"
                                type="password"
                                value={formData.password2}
                                onChange={handleChange}
                                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                                placeholder="Enter password again"
                            />
                        </div>

                        {/* <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="text-gray-800 ml-3 block text-sm"
                            >
                                I accept the
                                <a
                                    href="javascript:void(0);"
                                    className="text-blue-600 font-semibold hover:underline ml-1"
                                >
                                    Terms and Conditions
                                </a>
                            </label>
                        </div> */}
                    </div>

                    <div className="!mt-12">
                        {loading && <LoadingIndicator />}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                            Create an account
                        </button>
                    </div>

                    <p className="text-gray-800 text-sm mt-6 text-center">
                        Already have an account?
                        <Link
                            to='/login'
                            className="text-blue-600 font-semibold hover:underline ml-1"
                        >
                            Login here
                        </Link>
                        <br />
                        <Link to='/' className="text-gray-600 hover:underline ml-1 whitespace-nowrap font-semibold">
                            Go Back
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register