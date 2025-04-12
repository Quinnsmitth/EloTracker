import React from 'react'
import EloInput from '../../eloInput' // Adjust path if needed
import './rng.css'

const ChessInput = () => {
    return (
        <div className="elo-updater-wrapper">
            <EloInput gameType="numberGuesserElo" loseType="rngLoses" winType="rngWins" />
        </div>
    )
}

export default ChessInput
