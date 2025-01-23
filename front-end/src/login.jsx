import React, { useState } from 'react';
import { useHistory} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const fetchLogin =  (event) => {
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, pass:password }),
              })
                .then((res) => res.json()) // Convert response to JSON
                .then((data) => {
                  const token = data.token; // Access the token
                  if(token){
                  const username2 = data.name;
                  const role = data.role;
                  console.log("Token:", token);
                  localStorage.setItem("authToken", token); // Store it securely
                  localStorage.setItem("username", username2);
                  localStorage.setItem("role", role);
                  localStorage.setItem("branchid", data.branchid);
                  console.log(localStorage)
                  if(role === "staff"){
                  history.push('./staffproducts', { username:username2,role:role});}else{
                    history.push('./stock', { username:username2,role:role});
                  }}
                  
                })
                .catch((error) => console.error("Login error:", error));
                
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
                        <div className="text-gray-500 text-sm mb-4 underline items-right text-right block invisible">Forgot password</div>
                        <button className='p-3 bg-red-500 text-white rounded-md hover:bg-black items-center' onClick={handleLogin}>Enter</button>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Login;