import React from 'react'
import EloInput from '../../eloInput'
import '../games.css'

const ChessInput = () => {
    return (
        <div className="game-container">

            <div className="elo-updater-wrapper">
                <EloInput gameType="rpsElo" loseType="rpsLoses" winType="rpsWins"/>
            </div>
        </div>
    )
}

export default ChessInput
