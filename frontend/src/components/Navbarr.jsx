import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './ProfileDropdown';
import { useAuth } from '../context/AuthContext';
import useProfileData from './hooks/useProfileData';
import Modal from './Modal';
import CreateSessionForm from './sessions/CreateSessionForm';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthorized } = useAuth();
    const {user} = useProfileData()


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/landing" className="text-2xl font-bold text-blue-600">Tosome</Link>
                    </div>

                    {/* Menu Links (Hidden on mobile) */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/home" className="text-gray-600 hover:text-blue-600">Home</Link>
                        <Link to="/student" className="text-gray-600 hover:text-blue-600">Find a Tutor</Link>
                        {user.user_type === 'tutor' ? (
                            <div>
                                <CreateSessionForm/>
                            </div>
                        ) : (
                            <div></div>
                        )}

                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center">
                        <input
                            type="text"
                            placeholder="Search for a tutor..."
                            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* User Auth (Login/Signup or Profile) */}

                    <div className="flex items-center space-x-4">
                        {isAuthorized
                            ?
                            <div>
                                <Dropdown />
                            </div>
                            :
                            <div>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                                <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
                            </div>
                        }
                    </div>


                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/home" className="block text-gray-600 hover:text-blue-600">Home</Link>
                    <Link to="/student" className="block text-gray-600 hover:text-blue-600">Find a Tutor</Link>
                    <Link to="/subjects" className="block text-gray-600 hover:text-blue-600">Subjects</Link>
                    <Link to="/about" className="block text-gray-600 hover:text-blue-600">About Us</Link>
                    <Link to="/contact" className="block text-gray-600 hover:text-blue-600">Contact Us</Link>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500 mt-2"
                    />
                </div>
            )}
        </nav>
    );
};

export default Navbar;
