import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../authContext/index.jsx';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth.js';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase.js';
import "../AuthForm.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters long.");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);

      try {
        // Check if username is already taken
        const usernameQuery = query(
            collection(firestore, 'Player'),
            where('displayName', '==', username)
        );
        const querySnapshot = await getDocs(usernameQuery);

        if (!querySnapshot.empty) {
          setErrorMessage('Username already exists. Please choose another.');
          setIsRegistering(false);
          return;
        }

        // Create user
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save to Firestore
        await setDoc(doc(firestore, 'Player', user.uid), {
          email: user.email,
          displayName: username,
          chessElo: 1500,
          rpsElo: 1500,
          numberGuesserElo: 1500,
          reports: null,
          userID: user.uid,
        });

        navigate('/home'); // Redirect to home
      } catch (error) {
        console.error("Registration Error:", error.message);
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
      <>
        {userLoggedIn && <Navigate to="/home" replace={true} />}

        <main className="w-full h-screen flex self-center place-content-center place-items-center">
          <div className="register-container">
            <div className="register-box">
              <div className="text-center mb-6">
                <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-bold">Email</label>
                  <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-bold">Username</label>
                  <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-bold">Password</label>
                  <input
                      type="password"
                      autoComplete="new-password"
                      required
                      disabled={isRegistering}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
                  <input
                      type="password"
                      autoComplete="off"
                      required
                      disabled={isRegistering}
                      value={confirmPassword}
                      onChange={(e) => setconfirmPassword(e.target.value)}
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>

                {errorMessage && <span className="text-red-600 font-bold">{errorMessage}</span>}

                <button
                    type="submit"
                    disabled={isRegistering}
                    className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                        isRegistering
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                    }`}
                >
                  {isRegistering ? 'Signing Up...' : 'Sign Up'}
                </button>

                <div className="text-sm text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-center text-sm hover:underline font-bold">
                    Continue
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </>
  );
};

export default Register;
