import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth.js'
import { useAuth } from '../../../authContext/index.jsx'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebase.js'
import '../AuthForm.css';

const AdminLogin = () => {
  // Assuming your auth context can determine if an admin is logged in
  const { userLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('') // username OR email
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

      // If identifier does NOT contain "@", assume it's a username
      if (!identifier.includes('@')) {
        // Look in the 'Admin' collection instead of 'Player'
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
      // Redirect to the admin dashboard route after successful login
      navigate('/admin/dashboard')
    } catch (error) {
      console.error(error.message)
      setErrorMessage('Invalid credentials. Please try again.')
      setIsSigningIn(false)
    }
  }

  const onGoogleSignIn = async (e) => {
    e.preventDefault()
    if (isSigningIn) return
    setIsSigningIn(true)
    setErrorMessage('')

    try {
      const userCredential = await doSignInWithGoogle()
      const user = userCredential.user

      const adminRef = doc(firestore, 'Admin', user.uid)
      const adminSnap = await getDoc(adminRef)

      // If a new admin logged in via Google OR no admin document exists yet, create one.
      if (userCredential.additionalUserInfo?.isNewUser || !adminSnap.exists()) {
        await setDoc(adminRef, {
          email: user.email,
          // You can add additional admin-specific fields here
          displayName: user.displayName || '',
          role: 'admin', // Marking the user as admin
          adminID: user.uid,
        })
        console.log('New Admin document created for Google user.')
      }

      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Google Sign-In Error:', error.message)
      setErrorMessage('Google sign-in failed. Please try again.')
      setIsSigningIn(false)
    }
  }

  // Optionally, if the admin is already logged in, redirect them directly.
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

          <div className="flex flex-row text-center w-full">
            <div className="border-b-2 mb-2.5 mr-2 w-full"></div>
            <div className="text-sm font-bold w-fit">OR</div>
            <div className="border-b-2 mb-2.5 ml-2 w-full"></div>
          </div>

          <button
            disabled={isSigningIn}
            onClick={onGoogleSignIn}
            className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium ${
              isSigningIn ? 'cursor-not-allowed' : 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Google Icon SVG content */}
            </svg>
            {isSigningIn ? 'Signing In...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin;
