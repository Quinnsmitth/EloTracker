import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase.js'; // Import your firebase config
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../../firebase/firebase.js'; // Import your Firebase Auth config
import { onAuthStateChanged } from 'firebase/auth';

const EloInputForm = () => {
    const [playerId, setPlayerId] = useState(''); // State to hold the player ID
    const [playerElo, setPlayerElo] = useState('');
    const [opponentElo, setOpponentElo] = useState('');
    const [didPlayerWin, setDidPlayerWin] = useState('');
    const [playerData, setPlayerData] = useState(null);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    // Function to fetch player data from Firestore
    const fetchPlayerData = async (id) => {
        try {
            const playerDoc = doc(firestore, 'players', id); // Use the player ID passed as a parameter
            const playerSnapshot = await getDoc(playerDoc);

            if (playerSnapshot.exists()) {
                const data = playerSnapshot.data();
                setPlayerData(data);
                setPlayerElo(data.elo); // Set player ELO from fetched data
            } else {
                setError('No such player found!');
            }
        } catch (error) {
            setError('Error fetching player data: ' + error.message);
        }
    };

    // UseEffect to check authentication state and fetch player data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid); // Set current user ID
                fetchPlayerData(user.uid); // Fetch player data using the logged-in user ID
            } else {
                setError('No user is currently logged in.');
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate input and submission logic here...
        console.log({
            playerElo: parseInt(playerElo, 10),
            opponentElo: parseInt(opponentElo, 10),
            winner: didPlayerWin === 'yes' ? 'Player' : 'Opponent',
            loser: didPlayerWin === 'yes' ? 'Opponent' : 'Player',
        });

        // Reset form fields
        setPlayerElo('');
        setOpponentElo('');
        setDidPlayerWin('');
    };

    return (
        <div>
            <h2>Elo Score Submission</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {playerData && (
                <div>
                    <p>Player Name: {playerData.name}</p>
                    <p>Player Elo: {playerData.elo}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Opponent Elo Score:
                        <input
                            type="number"
                            value={opponentElo}
                            onChange={(e) => setOpponentElo(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Did the Player Win?
                        <select value={didPlayerWin} onChange={(e) => setDidPlayerWin(e.target.value)} required>
                            <option value="">Select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EloInputForm;
