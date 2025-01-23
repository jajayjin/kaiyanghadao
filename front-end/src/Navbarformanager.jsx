import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { Link, useLocation, useHistory } from "react-router-dom";

const Navbarformanager = () => {
    const location = useLocation();
    const history = useHistory();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown visibility

    const handleLogout = () => {
        localStorage.clear();
        setLoggedIn(false);
        history.push("/login"); // Redirect to the login page after logout
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setLoggedIn(true);
            setUsername(storedUsername);
        } else {
            setLoggedIn(false);
            setUsername("");
        }
    }, []);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="w-full flex justify-between items-center bg-black text-white border-b-2 border-[#e66b4b] p-4">
            {/* Left Links */}
            <div className="flex items-center space-x-4">
                <Link 
                    className="text-white bg-red-500 mt-3 mb-3 px-4 py-2 rounded hover:text-[#f1356d]" 
                    to="/stock"
                >
                    Check Stock
                </Link>
                <Link 
                    className="text-white bg-red-500 mt-3 mb-3 px-4 py-2 rounded hover:text-[#f1356d]" 
                    to="/Sellsummary"
                >
                    Sum Sell
                </Link>
                <Link 
                    className="text-white bg-red-500 mt-3 mb-3 px-4 py-2 rounded hover:text-[#f1356d]" 
                    to="/staffproducts"
                >
                    Staff
                </Link>
            </div>

            {/* Right Side: User Profile */}
            <div className="flex items-center space-x-4">
                {loggedIn ? (
                    <>
                        {/* Username Display */}
                        <div className="text-white font-medium">{`Hello, ${username}`}</div>
                        
                        {/* Dropdown */}
                        <div className="relative">
                            <button
                                id="avatarButton"
                                type="button"
                                className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center focus:outline-none"
                                onClick={toggleDropdown} // Toggle dropdown on button click
                            >
                                {username.charAt(0).toUpperCase()} {/* First letter of username */}
                            </button>
                            {dropdownOpen && ( // Only render dropdown if state is open
                                <div
                                    id="userDropdown"
                                    className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute right-0 mt-2"
                                >
                                    
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="text-white bg-green-500 px-4 py-2 rounded hover:bg-green-400"
                    >
                        Log In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbarformanager;
