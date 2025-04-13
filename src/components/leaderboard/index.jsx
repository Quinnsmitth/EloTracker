import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import './Leaderboard.css'; // ← Add this import

const Leaderboard = () => {
    const [gameType, setGameType] = useState('chessElo');
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const gameOptions = [
        { label: 'Chess', value: 'chessElo' },
        { label: 'Rock Paper Scissors', value: 'rpsElo' },
        { label: 'Number Guesser', value: 'numberGuesserElo' },
    ];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const playerCollection = collection(firestore, 'Player');
                const q = query(playerCollection, orderBy(gameType, 'desc'), limit(10));
                const querySnapshot = await getDocs(q);

                const topPlayers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setLeaders(topPlayers);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [gameType]);

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>

            <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                className="leaderboard-select"
            >
                {gameOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {loading ? (
                <p className="leaderboard-loading">Loading leaderboard...</p>
            ) : (
                <ol className="leaderboard-list">
                    {leaders.map((player) => (
                        <li key={player.id}>
                            {player.displayName || 'Unnamed'} – {player[gameType] || 1000}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default Leaderboard;
