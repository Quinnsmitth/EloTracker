import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase.js';
import { useNavigate } from 'react-router-dom';
import "./username.css";
const UsernameSetup = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleUsernameChange = async () => {
        if (!username) {
            setError('Username cannot be empty');
            return;
        }

        if (!currentUser) {
            setError('User is not logged in');
            return;
        }

        try {
            await updateDoc(doc(firestore, 'Player', currentUser.uid), {
                displayName: username,
            });
            navigate('/home');
        } catch (err) {
            setError('Error setting username: ' + err.message);
        }
    };

    return (
        <div className="username-setup-container">
            <h2>Set Your Username</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
            />
            <button onClick={handleUsernameChange}>Save Username</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default UsernameSetup;
