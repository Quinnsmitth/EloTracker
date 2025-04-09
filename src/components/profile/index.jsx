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
        </div>
    )
}

export default Profile