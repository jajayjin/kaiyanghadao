import React, { useState } from 'react';
import { useHistory} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const fetchLogin = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(`/login?username=${username}&password=${password}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        alert("Not found user");
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.results) && data.results.length > 0) {
                    // User found
                    if (data.status === "0") {
                        alert("Not found user");
                    } else if (data.status === "1") {
                        console.log(data.results);
                        localStorage.setItem("access_token", data.access_token);
                        localStorage.setItem("username", username);
                        localStorage.setItem("AID", data.results[0].AID);
                        history.push('./ProductManage', { user: data.results[0] });
                    }
                } else {
                    console.error('No user found');
                }
            })
            .catch(error => {
                console.error('Error fetching login:', error);
            });
    };

    const handleLogin = () => {
        fetchLogin()
    };

    return (
        <div>
            <div className="bg-cover bg-center min-h-screen font-roboto " >
            <h2 className='text-5xl font-bold mb-8 text-center invisible'>ffd</h2>
                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-5 mx-auto my-32">
                <h2 className='text-5xl font-bold mb-8 text-center'>Log In</h2>
                <div className="form-group">
                    <input 
                        className='rounded-md p-2 w-full border border-gray-300 block mb-10'
                        type="text" 
                        id="username" 
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                 <div className="form-group">
                    <input 
                        className='rounded-md p-2 w-full border border-gray-300'
                        type="password" 
                        id="password" 
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                    <div className="form-group flex flex-col ">
                        <div className="text-gray-500 text-sm mb-4 underline items-right text-right block mb-5 invisible">Forgot password</div>
                        <button className='p-3 bg-red-500 text-white rounded-md hover:bg-black items-center' onClick={handleLogin}>Enter</button>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Login;