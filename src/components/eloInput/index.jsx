import React, { useState } from 'react';
import { useAuth } from '../../authContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const EloInput = ({ gameType, winType, loseType }) => {
    const { currentUser } = useAuth();
    const [opponentElo, setOpponentElo] = useState('');
    const [gameResult, setGameResult] = useState('win');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const K = 32;

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
            <form onSubmit={handleSubmit} className="elo-form">
                <label>
                    Opponent Elo:
                    <input
                        type="number"
                        value={opponentElo}
                        onChange={(e) => setOpponentElo(e.target.value)}
                        required
                        disabled={loading}
                    />
                </label>
                <label>
                    Result:
                    <select
                        value={gameResult}
                        onChange={(e) => setGameResult(e.target.value)}
                        disabled={loading}
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
    );
};

export default EloInput;
