import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth.js'
import { useAuth } from '../../../authContext/index.jsx'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebase.js'
import '../AuthForm.css';


const Login = () => {
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

  const onGoogleSignIn = async (e) => {
    e.preventDefault()
    if (isSigningIn) return
    setIsSigningIn(true)
    setErrorMessage('')

    try {
      const userCredential = await doSignInWithGoogle()
      const user = userCredential.user

      const playerRef = doc(firestore, 'Player', user.uid)
      const playerSnap = await getDoc(playerRef)

      if (userCredential.additionalUserInfo?.isNewUser || !playerSnap.exists()) {
        await setDoc(playerRef, {
          email: user.email,
          chessElo: 1500,
          rpsElo: 1500,
          numberGuesserElo: 1500,
          reports: null,
          userID: user.uid,
          displayName: user.displayName || '', // default empty if no username yet
        })
        console.log('New Player document created for Google user.')
      }

      navigate('/home')
    } catch (error) {
      console.error('Google Sign-In Error:', error.message)
      setErrorMessage('Google sign-in failed. Please try again.')
      setIsSigningIn(false)
    }
  }

  if (userLoggedIn) {
    return <Navigate to="/home" replace={true} />
  }

  return (
      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center">
            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Welcome Back</h3>
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
                    isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                }`}
            >
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm">
            Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Sign up</Link>
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
              {/* Google Icon */}
            </svg>
            {isSigningIn ? 'Signing In...' : 'Continue with Google'}
          </button>
        </div>
      </main>
  )
}

export default Login
