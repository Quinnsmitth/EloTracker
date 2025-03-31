import React from 'react'
import { useAuth } from '../../authContext/index.jsx'
import './Home.css'

const Home = () => {
  const { currentUser } = useAuth()
  return (
    <div className="home-container">
      Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
    </div>
  )
}

export default Home
