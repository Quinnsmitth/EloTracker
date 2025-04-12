import React from 'react'
import EloInput from '../../eloInput'
import './rps.css'

const ChessInput = () => {
    return (
        <div className="elo-updater-wrapper">
            <EloInput gameType="rpsElo" loseType="rpsLoses" winType="rpsWins"/>
        </div>
    )
}

export default ChessInput
