import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../../../firebase/auth.js'
import { useAuth } from '../../../authContext/index.jsx'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebase.js'
import '../AuthForm.css';

const AdminLogin = () => {
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
        const adminsRef = collection(firestore, 'Admin')
        const q = query(adminsRef, where('displayName', '==', identifier))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setErrorMessage('Admin username not found')
          setIsSigningIn(false)
          return
        }

        emailToUse = querySnapshot.docs[0].data().email
      }

      await doSignInWithEmailAndPassword(emailToUse, password)
      navigate('/admin/dashboard')
    } catch (error) {
      console.error(error.message)
      setErrorMessage('Invalid credentials. Please try again.')
      setIsSigningIn(false)
    }
  }

  if (userLoggedIn) {
    return <Navigate to="/admin/dashboard" replace={true} />
  }

  return (
      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="login-container">
          <div className="login-box">
            <div className="text-center">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Admin Sign In</h3>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-600 font-bold">Username or Email</label>
                <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-bold">Password</label>
                <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>
              {errorMessage && (
                  <span className="text-red-600 font-bold">{errorMessage}</span>
              )}
              <button
                  type="submit"
                  disabled={isSigningIn}
                  className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                      isSigningIn
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                  }`}
              >
                {isSigningIn ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm">
              Not an admin yet?{' '}
              <Link to={'/admin/register'} className="hover:underline font-bold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
  )
}

export default AdminLogin
