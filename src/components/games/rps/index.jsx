import React from 'react'
import EloInput from '../../eloInput'
import '../games.css'

const ChessInput = () => {
    return (
        <div className="game-container">

            <div className="elo-updater-wrapper">
                <EloInput gameType="RPS" loseType="rpsLoses" winType="rpsWins"/>
            </div>
        </div>
    )
}

export default ChessInput
