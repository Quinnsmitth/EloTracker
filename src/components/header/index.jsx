import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../authContext/index.jsx'
import { doSignOut } from '../../firebase/auth.js'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="navbar-toggle" onClick={toggleNav}>
            ☰
          </button>
        </div>
        <div className="navbar-center">
          <Link to="/" className="navbar-brand">Bad Bishop</Link>
        </div>
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
      <div className={`collapsible-nav ${isNavOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleNav}>
          &times;
        </button>
        <Link className="nav-link" to="/link1" onClick={toggleNav}>
          Link 1
        </Link>
        <Link className="nav-link" to="/link2" onClick={toggleNav}>
          Link 2
        </Link>
        <Link className="nav-link" to="/profile" onClick={toggleNav}>
          Profile
        </Link>
        <Link className="nav-link" to="/eloInput" onClick={toggleNav}>
          ELO Input
        </Link>
        {/* Add more links here as needed */}
      </div>
    </>
  )
}

export default Header
