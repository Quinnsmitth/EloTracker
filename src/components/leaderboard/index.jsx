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

                await new Promise((resolve) => setTimeout(resolve, 350))

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

            <div className="game-switch">
            {gameOptions.map((option) => (
                <button
                key={option.value}
                className={`game-button ${gameType === option.value ? 'active' : ''}`}
                onClick={() => setGameType(option.value)}
                >
                {option.label}
                </button>
            ))}
            </div>


            {loading ? (
                <p className="leaderboard-loading">Loading leaderboard...</p>
            ) : (
                <div className="leaderboard-scroll-container">
                    <ol key={gameType} className="leaderboard-list fade-in">
                        {leaders.map((player, index) => (
                            <li key={player.id}>
                                <span>{index + 1}. {player.displayName || 'Unnamed'}</span>
                                <span>{player[gameType] || 1000}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

        </div>
    );
};

export default Leaderboard;
