import React from 'react'
import EloInput from '../../eloInput' // Adjust path if needed
import './rps.css'

const ChessInput = () => {
    return (
        <div className="elo-updater-wrapper">
            <EloInput type="rpsElo" />
        </div>
    )
}

export default ChessInput
