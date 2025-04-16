import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../../../firebase/auth.js'
import { useAuth } from '../../../authContext/index.jsx'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebase.js'
import '../AuthForm.css'

const Login = () => {
  const { userLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (isSigningIn) return
    setIsSigningIn(true)
    setErrorMessage('')

    try {
      let emailToUse = identifier

      if (!identifier.includes('@')) {
        const usersRef = collection(firestore, 'Player')
        const q = query(usersRef, where('displayName', '==', identifier))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setErrorMessage('Username not found')
          setIsSigningIn(false)
          return
        }

        emailToUse = querySnapshot.docs[0].data().email
      }

      await doSignInWithEmailAndPassword(emailToUse, password)
      navigate('/home')
    } catch (error) {
      console.error(error.message)
      setErrorMessage('Invalid credentials. Please try again.')
      setIsSigningIn(false)
    }
  }

  if (userLoggedIn) {
    return <Navigate to="/home" replace={true} />
  }

  return (
      <main>
        <div className="login-container">
          <div className="login-box">
            <h3>Welcome to Bad Bishop</h3>
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label>Username or Email</label>
                <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMessage && (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</span>
              )}
              <button type="submit" disabled={isSigningIn}>
                {isSigningIn ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p style={{ marginTop: '20px' }}>
              Don't have an account? <Link to="/register"><strong>Sign up</strong></Link>
            </p>
          </div>
        </div>
      </main>
  )
}

export default Login
