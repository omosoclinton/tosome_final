import React, { useState } from 'react';
import api from '../../api';

const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle search query input
    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 2) { // Start searching after 3 characters
            setIsLoading(true);
            try {
                const response = await api.get(`/api/tutors/search?q=${value}`);
                setResults(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch search results.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative">
            {/* Search bar */}
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search for tutors..."
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />

            {/* Display loading spinner */}
            {isLoading && <p className="text-blue-500 mt-2">Searching...</p>}

            {/* Display search results */}
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10">
                {results.length > 0 && (
                    <ul className="divide-y divide-gray-200">
                        {results.map((tutor) => (
                            <li
                                key={tutor.id}
                                className="p-4 hover:bg-blue-50 cursor-pointer"
                                onClick={() => window.location.href = `/tutors/${tutor.id}`} // Redirect to tutor's details page
                            >
                                <p className="font-semibold">{tutor.user.first_name} {tutor.user.last_name}</p>
                                <p className="text-sm text-gray-600">{tutor.subjects}</p>
                                <p className="text-sm text-gray-500">{tutor.location}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Display error message */}
                {error && <p className="text-red-500">{error}</p>}

                {/* No results */}
                {!isLoading && query.trim().length > 2 && results.length === 0 && (
                    <p className="p-4 text-gray-500">No tutors found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
