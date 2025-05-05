import React from 'react'
import { Link } from 'react-router-dom'
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
        <Link to="/rps" className="game-card rps-card">Rock Paper Scissors</Link>
        <Link to="/chess" className="game-card chess-card">Chess</Link>
        <Link to="/rng" className="game-card rng-card">Random Number Guesser</Link>
      </div>
    </div>
  )
}

export default Home
