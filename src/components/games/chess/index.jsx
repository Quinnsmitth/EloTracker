import React from 'react'
import EloInput from '../../eloInput' // Adjust path if needed
import './chess.css'

const ChessInput = () => {
    return (
        <div className="elo-updater-wrapper">
            <EloInput gameType="chessElo" winType="chessWins" loseType="chessLoses"/>
        </div>
    )
}

export default ChessInput
