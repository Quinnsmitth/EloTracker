import React, { useState } from 'react'
import { useAuth } from '../../../authContext'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebase'
import './chess.css'//input elo
const ChessInput = () => {
    const { currentUser } = useAuth()
    const [opponentElo, setOpponentElo] = useState('')
    const [gameResult, setGameResult] = useState('win')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const K = 32

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const playerRef = doc(firestore, 'Player', currentUser.uid)
            const playerSnap = await getDoc(playerRef)

            if (!playerSnap.exists()) {
                setMessage('Player not found in database.')
                return
            }

            const playerData = playerSnap.data()
            const currentElo = playerData.chessElo || 1000
            const oppElo = parseInt(opponentElo)

            const expectedScore = 1 / (1 + Math.pow(10, (oppElo - currentElo) / 400))
            const actualScore = gameResult === 'win' ? 1 : 0
            const newElo = Math.round(currentElo + K * (actualScore - expectedScore))

            await updateDoc(playerRef, {
                chessElo: newElo,
            })

            setMessage(`Elo updated! New Elo: ${newElo}`)
        } catch (error) {
            console.error('Elo update failed:', error)
            setMessage('Error updating Elo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="elo-updater-container">
            <h2>Update Chess Elo:</h2>
            <form onSubmit={handleSubmit} className="elo-form">
                <label>
                    Opponent Elo:
                    <input
                        type="number"
                        value={opponentElo}
                        onChange={(e) => setOpponentElo(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Result:
                    <select
                        value={gameResult}
                        onChange={(e) => setGameResult(e.target.value)}
                    >
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                    </select>
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Elo'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default ChessInput
