import React, { useState, useEffect } from 'react'
import { useAuth } from '../../authContext/index.jsx'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../firebase/firebase.js'
import './Profile.css'

const Profile = () => {
  const { currentUser } = useAuth()
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedGame, setSelectedGame] = useState('chess') // default to Chess

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const fetchPlayerData = async () => {
        try {
          const docRef = doc(firestore, 'Player', currentUser.uid)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            setPlayerData(docSnap.data())
          } else {
            setError('No player data found.')
          }
        } catch (err) {
          console.error('Error fetching player data:', err)
          setError('Error fetching player data.')
        } finally {
          setLoading(false)
        }
      }
      fetchPlayerData()
    }
  }, [currentUser])

  const handleGameChange = (e) => {
    setSelectedGame(e.target.value)
  }

  const renderGameStats = () => {
    if (!playerData) return null

    switch (selectedGame) {
      case 'rps':
        return (
            <>
              <p><strong>Rock Paper Scissors Elo:</strong> {playerData.rpsElo ?? 0}</p>
              <p><strong>Rock Paper Scissors Wins:</strong> {playerData.rpsWins ?? 0}</p>
              <p><strong>Rock Paper Scissors Loses:</strong> {playerData.rpsLoses ?? 0}</p>
            </>
        )
      case 'numberGuesser':
        return (
            <>
              <p><strong>Random Number Guesser Elo:</strong> {playerData.numberGuesserElo ?? 0}</p>
              <p><strong>Number Guesser Wins:</strong> {playerData.rngWins ?? 0}</p>
              <p><strong>Number Guesser Loses:</strong> {playerData.rngLoses ?? 0}</p>
            </>
        )
      case 'chess':
        return (
            <>
              <p><strong>Chess Elo:</strong> {playerData.chessElo ?? 0}</p>
              <p><strong>Chess Wins:</strong> {playerData.chessWins ?? 0}</p>
              <p><strong>Chess Loses:</strong> {playerData.chessLoses ?? 0}</p>
            </>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
        <div className="profile-container">
          <p>Loading player data...</p>
        </div>
    )
  }

  if (error) {
    return (
        <div className="profile-container">
          <p className="error-message">{error}</p>
        </div>
    )
  }

  return (
      <div className="profile-container">
        <h1>Player Profile</h1>
        <div className="profile-card">
          <p><strong>Username:</strong> {playerData.displayName || currentUser.displayName}</p>

          <label htmlFor="game-select"><strong>Select Game:</strong></label>
          <select id="game-select" value={selectedGame} onChange={handleGameChange}>
            <option value="rps">Rock Paper Scissors</option>
            <option value="numberGuesser">Random Number Guesser</option>
            <option value="chess">Chess</option>
          </select>


          <div className="game-stats">
            {renderGameStats()}
          </div>
        </div>
      </div>
  )
}

export default Profile
