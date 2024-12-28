import React, { useEffect, useState } from 'react';
import { GoSearch } from "react-icons/go";
import { Link, useLocation, useHistory} from 'react-router-dom';

const Navbarwithsearch = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const history = useHistory();

    const handleLogout = () => {
        localStorage.clear();
    };

    useEffect(() => {
        const userID = localStorage.getItem("AID");
        if (userID !== null) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    return (
        <nav className="w-full flex justify-between items-center bg-black text-white border-b-2 border-[#e66b4b]">
            

            <div className="flex items-center space-x-4">
                <Link className="text-white bg-red-500 px-4 py-2 rounded hover:text-[#f1356d]" to="/aboutus">About Us</Link>
                
                {((location.pathname === "/searchHome" ) && loggedIn) ? (
                    <Link 
                        className="text-white bg-red-500 px-4 py-2 rounded hover:text-[#f1356d]" 
                        onClick={handleLogout} 
                        to="/"
                    >
                        Logout
                    </Link>
                ) : (
                    <Link 
                        className="text-white bg-red-500 px-4 py-2 rounded hover:text-[#f1356d]" 
                        to="/login"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbarwithsearch;
