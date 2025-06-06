import React from 'react'
import EloInput from '../../eloInput'
import '../games.css'

const ChessInput = () => {
    return (
        <div className="game-container">

            <div className="elo-updater-wrapper">
                <EloInput gameType="chessElo" winType="chessWins" loseType="chessLoses"/>
            </div>
        </div>
    )
}

export default ChessInput
