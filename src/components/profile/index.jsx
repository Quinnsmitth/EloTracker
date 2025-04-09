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

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const fetchPlayerData = async () => {
        try {
          console.log("Fetching player data for UID:", currentUser.uid)

          // Create the document reference for the Player collection
          const docRef = doc(firestore, 'Player', currentUser.uid)
          const docSnap = await getDoc(docRef)
          console.log("Document snapshot obtained:", docSnap)

          if (docSnap.exists()) {
            console.log("Document data found:", docSnap.data())
            setPlayerData(docSnap.data())
          } else {
            console.warn("No document exists for UID:", currentUser.uid)
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
        <p>
          <strong>Email:</strong> {playerData.email || currentUser.email}
        </p>
        <p>
          <strong>Chess Elo:</strong> {playerData.chessElo}
        </p>
        <p>
          <strong>Rock Paper Scissors Elo:</strong> {playerData.rpsElo}
        </p>
        <p>
          <strong>Random Number Guesser Elo:</strong> {playerData.numberGuesserElo}
        </p>
      </div>
    </div>
  )
}

export default Profile
