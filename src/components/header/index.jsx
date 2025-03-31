import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../authContext/index.jsx'
import { doSignOut } from '../../firebase/auth.js'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()
  return (
    <nav className="navbar">
      <div className="navbar-left" />
      <div className="navbar-center">Bad Bishop</div>
      <div className="navbar-right">
        {userLoggedIn ? (
          <button
            className="navbar-button"
            onClick={() => doSignOut().then(() => navigate('/login'))}
          >
            Logout
          </button>
        ) : (
          <>
            <Link className="navbar-link" to="/login">
              Login
            </Link>
            <Link className="navbar-link" to="/register">
              Register New Account
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Header
