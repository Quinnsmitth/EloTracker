import React from 'react'
import EloInput from '../../eloInput' // Adjust path if needed
import '../games.css'

const ChessInput = () => {
    return (
        <div className="game-container">

            <div className="elo-updater-wrapper">
                <EloInput gameType="Chess" winType="chessWins" loseType="chessLoses"/>
            </div>
        </div>
    )
}

export default ChessInput
