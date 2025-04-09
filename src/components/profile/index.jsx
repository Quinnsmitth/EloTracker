import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../authContext/index.jsx'
import './Profile.css'

const Profile = () => {
    const { currentUser } = useAuth()
    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <p>Email: {currentUser.displayName}</p>
            <p>Chess Elo: 1500</p>
            <p>Random Number Guesser Elo: 1500</p>
            <p>Rock Papaer Scissors Elo: 1500</p>
        </div>
    )
}

export default Profile