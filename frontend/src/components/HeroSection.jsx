import React from 'react';
import "../assets/images/background.jpg"
import { Link } from 'react-router-dom';


function HeroSection() {
  return (
    <section className="bg-cover bg-center h-screen w-screen" style={{ backgroundImage: `url(./src/assets/images/background.jpg)`, backgroundSize: 'cover' }}>
      <nav className="absolute right-0 shadow-md fixed w-auto top-10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-13">
            <Link to="/login" className="bg-gray-500 text-white text-2xl px-6 py-3 rounded-lg hover:bg-blue-600">Login</Link>
            <Link to="/register" className="bg-white text-blue-500 text-2xl px-6 py-3 rounded-lg hover:bg-gray-100">Register</Link>
          </div>
        </div>
      </nav>
      <div className="flex flex-col justify-center items-center h-full bg-black bg-opacity-50">
        <p className="text-white text-2xl font-bold mb-4">TOSOME</p>
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center mb-4">
          Find the Perfect Tutor for Your Learning Needs
        </h1>
        <p className="text-white text-lg md:text-2xl text-center mb-8">
          Personalized tutoring for every subject and every level.
        </p>
        <div className="flex space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Find a Tutor
          </Link>
          <Link to="/tutor" className="bg-white text-blue-500 px-6 py-3 rounded-lg hover:bg-gray-100">
            Become a Tutor
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;