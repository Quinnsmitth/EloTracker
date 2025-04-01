import React from 'react'
import { useAuth } from '../../authContext/index.jsx'
import './Home.css'

const Home = () => {
  const { currentUser } = useAuth()
  return (
    <div className="home-container">
      <p>
        Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
      </p>
      <div className="game-grid">
        <div className="game-card">Rock Paper Scissors</div>
        <div className="game-card">Chess</div>
        <div className="game-card">Random Number Guesser</div>
      </div>
    </div>
  )
}

export default Home
