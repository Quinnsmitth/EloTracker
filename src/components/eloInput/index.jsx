import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import './eloInput.css';

export default function EloInput({ gameType, winType, loseType }) {
  const { currentUser } = useAuth();
  const [players, setPlayers]           = useState([]);
  const [opponentId, setOpponentId]     = useState('');
  const [opponentElo, setOpponentElo]   = useState(null);
  const [gameResult, setGameResult]     = useState('win');
  const [message, setMessage]           = useState('');
  const [loading, setLoading]           = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting]   = useState(false);

  // toggle the roprt textarea open
  const handleReportOnly = () => {
    setIsReporting(true);
  };

  // new handler just for reporting
  const handleReport = async () => {
      if (!opponentId) {
        setMessage('Please choose an opponent to report.');
        return;
      }
      if (!reportReason.trim()) {
        setMessage('Please enter a reason for your report.');
        return;
      }
          setLoading(true);
      try {
        await addDoc(collection(firestore, 'Reports'), {
          accuserId: currentUser.uid,
          accusedId: opponentId,
          reason: reportReason.trim(),
          gameType,
          date: new Date()
       });
        setMessage('Report submitted successfully.');
        setReportReason('');
        setIsReporting(false);
      } catch (err) {
        console.error('Submit report failed', err);
        setMessage('Failed to submit report.');
      } finally {
        setLoading(false);
      }
    };

  // 1) Load all other players
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(firestore, 'Player'));
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.id !== currentUser.uid);
      setPlayers(list);
    })();
  }, [currentUser.uid]);

  // 2) When opponent changes, update displayed Elo
  useEffect(() => {
    if (!opponentId) {
      setOpponentElo(null);
      return;
    }
    const opp = players.find(p => p.id === opponentId);
    setOpponentElo(opp ? opp[gameType] || 1000 : null);
  }, [opponentId, players, gameType]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!opponentId) {
      setMessage('Please select an opponent.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      // Fetch both docs
      const meRef  = doc(firestore, 'Player', currentUser.uid);
      const opRef  = doc(firestore, 'Player', opponentId);
      const [meSnap, opSnap] = await Promise.all([getDoc(meRef), getDoc(opRef)]);
      if (!meSnap.exists() || !opSnap.exists()) throw new Error('Player data missing');

      const meData = meSnap.data();
      const opData = opSnap.data();

      // Current Elo & stats
      const curElo = meData[gameType] || 1000;
      const curWins = meData[winType]  || 0;
      const curLoss= meData[loseType] || 0;
      const curGP  = (meData.gamesPlayed || 0) + 1;

      // Opponent Elo & stats
      const oppEloVal = opData[gameType] || 1000;
      const oppWins   = opData[winType]  || 0;
      const oppLoss   = opData[loseType] || 0;
      const oppGP     = (opData.gamesPlayed || 0) + 1;

      // Elo K-factors
      const Kme  = Math.max(16, 40 - 10 * Math.log10(curGP + 1));
      const Kop  = Math.max(16, 40 - 10 * Math.log10(oppGP + 1));

      // Expected scores
      const expMe = 1 / (1 + 10 ** ((oppEloVal - curElo) / 400));
      const expOp = 1 / (1 + 10 ** ((curElo - oppEloVal) / 400));

      // Actual
      const actualMe = gameResult === 'win' ? 1 : 0;
      const actualOp = 1 - actualMe;

      // New Elos
      const newEloMe = Math.round(curElo + Kme * (actualMe - expMe));
      const newEloOp = Math.round(oppEloVal + Kop * (actualOp - expOp));

      // Update wins/losses
      const updatedCurWins  = gameResult === 'win' ? curWins + 1 : curWins;
      const updatedCurLoss  = gameResult === 'loss' ? curLoss + 1 : curLoss;
      const updatedOppWins  = actualOp === 1         ? oppWins + 1 : oppWins;
      const updatedOppLoss  = actualOp === 0         ? oppLoss + 1 : oppLoss;

      // Batch-update both documents
      await Promise.all([
        updateDoc(meRef, {
          [gameType]: newEloMe,
          gamesPlayed: curGP,
          [winType]: updatedCurWins,
          [loseType]: updatedCurLoss,
        }),
        updateDoc(opRef, {
          [gameType]: newEloOp,
          gamesPlayed: oppGP,
          [winType]: updatedOppWins,
          [loseType]: updatedOppLoss,
        }),
      ]);

      // (Optional) report cheating if toggled
      if (isReporting && reportReason.trim()) {
        await addDoc(collection(firestore, 'Reports'), {
          accuserId: currentUser.uid,
          accusedId: opponentId,
          reason: reportReason.trim(),
          gameType,
          date: serverTimestamp(),
        });
      }

      setMessage(`Done! Your new Elo is ${newEloMe}. Opponent’s new Elo is ${newEloOp}.`);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error updating Elo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="elo-updater-container">
      <h2>Update {gameType}</h2>
      <form
        onSubmit={handleSubmit}
        className={`elo-form ${gameResult === 'win' ? 'bg-green' : 'bg-red'}`}
      >
        <label htmlFor="opponent">Opponent:</label>
        <select
          id="opponent"
          value={opponentId}
          onChange={e => setOpponentId(e.target.value)}
          disabled={loading}
          required
        >
          <option value="">-- select player --</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>
              {p.displayName || p.email || p.id}
            </option>
          ))}
        </select>

        {opponentElo !== null && (
          <p>Your opponent’s Elo: <strong>{opponentElo}</strong></p>
        )}

        <label>Did you win?</label>
        <div className="result-toggle">
          <button
            type="button"
            className="result-button yes"
            onClick={() => setGameResult('win')}
            disabled={loading}
          >
            Yes
          </button>
          <button
            type="button"
            className="result-button no"
            onClick={() => setGameResult('loss')}
            disabled={loading}
          >
            No
          </button>
        </div>

        <button
          type="button"
          className={"report-toggle-button"}
          onClick={() => setIsReporting(open => !open)}
        >
          {isReporting ? 'Cancel Report' : 'Report Opponent for Cheating'}
        </button>

        {isReporting && (
        <>
          <textarea
            placeholder="Explain why you're reporting this player…"
            value={reportReason}
            onChange={e => setReportReason(e.target.value)}
            disabled={loading}
            className="report-textarea"
          />

         {/* New Submit Report button */}
         <button
           type="button"
           className="submit-report-button"
           onClick={handleReport}
           disabled={loading}
         >
           {loading ? 'Submitting…' : 'Submit Report'}
         </button>
        </>
      )}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Submitting…' : 'Update Elo'}
        </button>
      </form>

      {message && <p className="elo-message">{message}</p>}
    </div>
  );
}
