import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import './eloInput.css';
import { set } from 'firebase/database';

const EloInput = ({ gameType, winType, loseType }) => {
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState([]);
  const [opponentId, setOpponentId] = useState('');
  const [gameResult, setGameResult] = useState('win');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  // load list of all players (for the dropdown)
  useEffect(() => {
    const loadPlayers = async () => {
      const snap = await getDocs(collection(firestore, 'Player'));
      setPlayers(
        snap.docs.map(d => ({
          id: d.id,
          name: d.data().displayName || d.id.slice(0,6),
        }))
      );
      // default-select first if none chosen
      if (!opponentId && snap.docs.length) {
        setOpponentId(snap.docs[0].id);
      }
    };
    loadPlayers();
  }, [opponentId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const meRef = doc(firestore, 'Player', currentUser.uid);
      const youRef = doc(firestore, 'Player', opponentId);

      const [meSnap, youSnap] = await Promise.all([
        getDoc(meRef),
        getDoc(youRef),
      ]);
      if (!meSnap.exists() || !youSnap.exists()) {
        throw new Error('Player record missing');
      }

      const me    = meSnap.data();
      const you   = youSnap.data();
      const curE  = me[gameType] || 1000;
      const oppE  = you[gameType]  || 1000;
      let   meWins   = me[winType]  || 0;
      let   meLosses = me[loseType] || 0;
      let   youWins  = you[winType]  || 0;
      let   youLoss  = you[loseType] || 0;
      let   mePlayed  = me.gamesPlayed  || 0;
      let   youPlayed = you.gamesPlayed || 0;

      // update wins/losses
      if (gameResult === 'win') {
        meWins     += 1;
        youLoss    += 1;
      } else {
        meLosses   += 1;
        youWins    += 1;
      }
      mePlayed  += 1;
      youPlayed += 1;

      // dynamic K-factor per player
      const Kme  = Math.max(16, 40 - 10 * Math.log10(mePlayed + 1));
      const Kyou = Math.max(16, 40 - 10 * Math.log10(youPlayed + 1));

      // expected scores
      const expMe  = 1 / (1 + 10 ** ((oppE - curE) / 400));
      const expYou = 1 / (1 + 10 ** ((curE - oppE) / 400));
      const actualMe  = gameResult === 'win' ? 1 : 0;
      const actualYou = gameResult === 'win' ? 0 : 1;

      // new Elos
      const newMeElo  = Math.round(curE  + Kme  * (actualMe  - expMe));
      const newYouElo = Math.round(oppE  + Kyou * (actualYou - expYou));

      // write both docs
      await Promise.all([
        updateDoc(meRef, {
          [gameType]: newMeElo,
          gamesPlayed: mePlayed,
          [winType]: meWins,
          [loseType]: meLosses,
        }),
        updateDoc(youRef, {
          [gameType]: newYouElo,
          gamesPlayed: youPlayed,
          [winType]: youWins,
          [loseType]: youLoss,
        }),
      ]);

      // optional report
      if (isReporting && reportReason.trim()) {
        await addDoc(collection(firestore, 'Reports'), {
          reporterId: currentUser.uid,
          reportedId: opponentId,
          reason: reportReason.trim(),
          gameType,
          date: new Date(),
        });
      }

      setMessage(
        `Done! Your new Elo: ${newMeElo}, Opponent's new Elo: ${newYouElo}`
      );
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      setMessage('Please provide a reason for reporting.');
      return;
    }

    setLoading(true);
    try {
        const reportRef = collection(firestore, 'Reports');
        await addDoc(reportRef, {
          reporterId: currentUser.uid,
          reportedId: opponentId,
          reason: reportReason.trim(),
          gameType,
          date: new Date(),
        });
        setMessage('Report submitted successfully!');
        setReportReason('');
        setIsReporting(false);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit report.');
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
          className="elo-input"
        >
          {players.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

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

        <div
          className={`report-box ${isReporting ? 'active' : ''}`}
          onClick={() => setIsReporting(r => !r)}
        >
          {isReporting ? 'Cancel Report' : 'Report Opponent for Cheating'}


            {isReporting && (
                <>
                    <textarea
                    placeholder="Explain why you're reporting this player…"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    disabled={loading}
                    className="report-textarea"
                />
                <button
                    type="button"
                    onClick={handleReport}
                    disabled={loading || !reportReason.trim()}
                    className="submit-report-button"
                >
                    {loading ? 'Submitting…' : 'Submit Report'}
                </button>
                </>
            )}
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Updating…' : 'Update Elo'}
        </button>
      </form>

      {message && <p className="elo-message">{message}</p>}
    </div>
  );
};

export default EloInput;
