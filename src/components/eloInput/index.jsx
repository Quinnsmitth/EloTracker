import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import './eloInput.css'

const EloInput = ({ gameType, winType, loseType }) => {
    const { currentUser } = useAuth();
    const [opponentElo, setOpponentElo] = useState('');
    const [gameResult, setGameResult] = useState('win');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const playerRef = doc(firestore, 'Player', currentUser.uid);
            const playerSnap = await getDoc(playerRef);

            if (!playerSnap.exists()) {
                setMessage('Player not found in database.');
                return;
            }

            const playerData = playerSnap.data();
            const currentElo = playerData[gameType] || 1000; // Use gameType for current Elo
            const oppElo = parseInt(opponentElo);
            // Initialize player wins and losses
            let playerWins = playerData[winType] || 0;
            let playerLoses = playerData[loseType] || 0;

            // Update wins/losses based on the game result
            if (gameResult === 'win') {
                playerWins += 1;
            } else {
                playerLoses += 1;
            }

            // Increment games played
            let n = playerData.gamesPlayed || 0;
            n++;

            // Calculate expected score and new Elo
            let K = Math.max(16, 40 - 10 * Math.log10(n + 1))
            const expectedScore = 1 / (1 + Math.pow(10, (oppElo - currentElo) / 400));
            const actualScore = gameResult === 'win' ? 1 : 0;
            const newElo = Math.round(currentElo + K * (actualScore - expectedScore));

            // Update Firestore document
            await updateDoc(playerRef, {
                [gameType]: newElo,
                gamesPlayed: n,
                [winType]: playerWins,
                [loseType]: playerLoses
            });

            setMessage(`Elo updated! New Elo: ${newElo}`);
        } catch (error) {
            console.error('Elo update failed:', error);
            setMessage('Error updating Elo.');
        } finally {
            setLoading(false);
        }
    };

    return (
                <div className="elo-updater-container">
        <h2>Update {gameType} Elo</h2>
        <form
        onSubmit={handleSubmit}
        className={`elo-form ${gameResult === 'win' ? 'bg-green' : 'bg-red'}`}
        >

            <label htmlFor="opponentElo">Opponent Elo:</label>
            <input
            id="opponentElo"
            type="number"
            placeholder="Enter opponent's Elo"
            value={opponentElo}
            onChange={(e) => setOpponentElo(e.target.value)}
            required
            disabled={loading}
            className="elo-input"
            />

            <label>Did you win?</label>
            <div className="result-toggle">
            <button
                type="button"
                className="result-button yes"
                onClick={() => setGameResult('win')}
                disabled={loading}
            >
                Yes
            </button>
            <button
                type="button"
                className="result-button no"
                onClick={() => setGameResult('loss')}
                disabled={loading}
            >
                No
            </button>
            </div>



            <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Updating...' : 'Update Elo'}
            </button>
        </form>

        {message && <p className="elo-message">{message}</p>}
        </div>

    );
};

export default EloInput;
