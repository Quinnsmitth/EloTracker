import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../authContext/index.jsx'
import './adminPage.css'

const Admin = () => {
  const { currentUser } = useAuth()
  return (
    <div className="admin-container">
      <p>
        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
      </p>
      <p>
        Ballz
      </p>
    </div>
  )
}

export default Admin