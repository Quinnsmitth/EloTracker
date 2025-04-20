import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../authContext/index.jsx'
import { doSignOut } from '../../firebase/auth.js'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../firebase/firebase.js'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { userLoggedIn, currentUser } = useAuth()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  // Check if the current logged-in user is an admin.
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          // Query the Admin collection for the current user's UID
          const adminDocRef = doc(firestore, 'Admin', currentUser.uid)
          const adminDoc = await getDoc(adminDocRef)
          setIsAdmin(adminDoc.exists())
        } catch (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }
    checkAdminStatus()
  }, [currentUser])

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
            <>
              {/* Only show the admin link if the user is an admin */}
              {isAdmin && (
                <Link className="navbar-link" to="/admin">
                  Admin
                </Link>
              )}
              <button
                className="navbar-button"
                onClick={() => doSignOut().then(() => navigate('/login'))}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="navbar-link" to="/admin/login">
                Admin
              </Link>
              <Link className="navbar-link" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className={`collapsible-nav ${isNavOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleNav}>
          &times;
        </button>

        {userLoggedIn ? (
          <>
            {!isAdmin && (
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            )}
            <Link className="nav-link" to="/leaderboard">
              Leaderboard
            </Link>
            {isAdmin && (
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            )}
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default Header
