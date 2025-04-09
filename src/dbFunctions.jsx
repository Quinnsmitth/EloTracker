import { getDatabase, ref, push, set } from "firebase/database";

function writePlayerData(email, password) {
    const db = getDatabase();

    // Get a reference to the 'Player' collection
    const playerRef = ref(db, '/Player');

    // Create a new child with a unique ID
    const newPlayerRef = push(playerRef);

    set(newPlayerRef, {
        playerId: newPlayerRef.key, // save the generated ID as part of the data
        email: email,
        password: password,
        chessElo: 1500,
        RpcElo: 1500,
        numberGuesserElo: 1500
    })
        .then(() => {
            console.log("Player created with ID:", newPlayerRef.key);
        })
        .catch((error) => {
            console.error("Failed to save player:", error);
        });
}
