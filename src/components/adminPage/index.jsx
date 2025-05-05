// src/components/Admin.jsx
import React, { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore'
import { firestore } from '../../firebase/firebase'
import { useAuth } from '../../authContext/index.jsx'
import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import './adminPage.css'

export default function Admin() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // --- Players Panel State ---
  const [players, setPlayers]           = useState([])
  const [showBanModal, setShowBanModal] = useState(false)
  const [banTarget, setBanTarget]       = useState(null)
  const [dropdownOpenId, setDropdownOpenId] = useState(null)

  const gameOptions = [
    { key: 'chess',  label: 'Chess',               elo: 'chessElo',           wins: 'chessWins',           losses: 'chessLosses'         },
    { key: 'rps',    label: 'Rock Paper Scissors', elo: 'rpsElo',             wins: 'rpsWins',             losses: 'rpsLosses'           },
    { key: 'number', label: 'Number Guesser',      elo: 'numberGuesserElo',   wins: 'numberGuesserWins',   losses: 'numberGuesserLosses' }
  ]
  const [selectedGame, setSelectedGame] = useState(gameOptions[0])

  // --- Inbox Panel State ---
  const [inboxItems, setInboxItems] = useState([])

  const [filterType, setFilterType] = useState('all')

  // Below where you compute displayed inbox rows:
  const displayedInbox = inboxItems.filter(item =>
    filterType === 'all'
      ? true
      : filterType === 'reports'
        ? item.type === 'Report'
        : item.type === 'Dispute'
  )

  const getPlayerById = id => players.find(p => p.id === id) || { displayName: id }

  // --- Common State ---
  const [loading, setLoading] = useState(true)

  // heper to look up a player's friendly name
  const getplayerName = uid => {
    const p = players.find(x => x.id === uid)
    return p ? (p.displayName || p.email || p.id)
      : uid;
  };

  // --- Modals ---
  const [modalItem, setModalItem]     = useState(null) // item = { type, id, ...data }
  const [showModal, setShowModal]     = useState(false)
  const [statsTarget, setStatsTarget] = useState(null)
  const [showStatsModal, setShowStatsModal] = useState(false)

  // --- Fetch data on mount ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Players
        const pSnap = await getDocs(collection(firestore, 'Player'))
        setPlayers(pSnap.docs.map(d => ({ id: d.id, ...d.data() })))

        // Reports & Disputes
        const repSnap = await getDocs(query(
          collection(firestore, 'Reports'),
          orderBy('date', 'desc')
        ))
        const disSnap = await getDocs(query(
          collection(firestore, 'Disputes'),
          orderBy('createdAt', 'desc')
        ))

        const reports = repSnap.docs.map(d => ({
          id: d.id,
          type: 'Report',
          ...d.data()
        }))
        const disputes = disSnap.docs.map(d => ({
          id: d.id,
          type: 'Dispute',
          ...d.data()
        }))

        // merge & sort
        const merged = [...reports, ...disputes].sort((a, b) => {
          const ta = (a.date || a.createdAt).toDate()
          const tb = (b.date || b.createdAt).toDate()
          return tb - ta
        })
        setInboxItems(merged)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- Player actions ---
  const toggleDropdown = id => setDropdownOpenId(open => open === id ? null : id)
  const onVisitProfile = p => { navigate(`/profile/${p.id}`); setDropdownOpenId(null) }
  const onBanClick     = p => { setBanTarget(p); setDropdownOpenId(null); setShowBanModal(true) }
  const confirmBan     = async () => {
    if (!banTarget) return
    try {
      await updateDoc(doc(firestore, 'Player', banTarget.id), { banned: true })
      setPlayers(ps => ps.map(p => p.id===banTarget.id ? {...p, banned:true} : p))
    } catch(e){ console.error(e) }
    finally { setShowBanModal(false); setBanTarget(null) }
  }
  const onFlag   = async p => { await updateDoc(doc(firestore,'Player',p.id),{flagged:true}); setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,flagged:true}:x)); setDropdownOpenId(null) }
  const onUnflag = async p => { await updateDoc(doc(firestore,'Player',p.id),{flagged:false}); setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,flagged:false}:x)); setDropdownOpenId(null) }
  const onUnban  = async p => { await updateDoc(doc(firestore,'Player',p.id),{banned:false}); setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,banned:false}:x)); setDropdownOpenId(null) }

  // --- Inbox actions ---
  const openItem = async item => {
    if (!item.read) {
      const col = item.type==='Report'?'Reports':'Disputes'
      await updateDoc(doc(firestore,col,item.id),{read:true})
      setInboxItems(is => is.map(i=>i.id===item.id?{...i,read:true}:i))
    }
    setModalItem(item)
    setShowModal(true)
  }
  const dismissItem = async item => {
    const col = item.type==='Report'?'Reports':'Disputes'
    await deleteDoc(doc(firestore,col,item.id))
    setInboxItems(is => is.filter(i=>i.id!==item.id))
  }
  const unbanUser = async it => {
    await updateDoc(doc(firestore,'Player', it.userId),{banned:false})
    setPlayers(ps=>ps.map(p=>p.id===it.userId?{...p,banned:false}:p))
    setShowModal(false)
  }
  const showStats = userId => {
    const p = players.find(x=>x.id===userId)
    setStatsTarget(p); setShowStatsModal(true)
  }

  if (loading) return <p className="admin-loading">Loading…</p>

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-panels">
        {/* ── Players Panel ── */}
        <div className="panel">
          <div className="panel-header">
            <h3>Players</h3>
            <div className="game-select">
              <label>
                Show stats for:&nbsp;
                <select
                  value={selectedGame.key}
                  onChange={e => setSelectedGame(
                    gameOptions.find(o=>o.key===e.target.value)
                  )}
                >
                  {gameOptions.map(o => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="panel-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th><th>Name</th><th>Email</th>
                  <th>ELO</th><th>Wins</th><th>Losses</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(p => {
                  const status = p.banned?'banned':p.flagged?'flagged':'active'
                  return (
                    <tr key={p.id}>
                      <td><span className={`status-indicator status-${status}`} /></td>
                      <td>{p.displayName||'—'}</td>
                      <td>{p.email||'—'}</td>
                      <td>{p[selectedGame.elo]??0}</td>
                      <td>{p[selectedGame.wins]??0}</td>
                      <td>{p[selectedGame.losses]??0}</td>
                      <td className="action-cell">
                        <Settings
                          className="gear-icon"
                          onClick={() => toggleDropdown(p.id)}
                        />
                        {dropdownOpenId === p.id && (
                          <ul className="dropdown-menu">
                            {/* <li onClick={() => onVisitProfile(p)}>Visit Profile</li> */}
                            {status === 'active' && <li onClick={() => onFlag(p)}>Flag</li>}
                            {status === 'flagged' && (
                              <>
                                <li onClick={() => onUnflag(p)}>Unflag</li>
                                <li onClick={() => onBanClick(p)}>Ban</li>
                              </>
                            )}
                            {status === 'active' && <li onClick={() => onBanClick(p)}>Ban</li>}
                            {status === 'banned' && <li onClick={() => onUnban(p)}>Unban</li>}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inbox Panel */}
        <div className="panel">
          <div className="panel-header">
            <h3>Inbox</h3>
            <div className="inbox-filter">
              <label>
                Show:&nbsp;
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="reports">Reports</option>
                  <option value="disputes">Disputes</option>
                </select>
              </label>
            </div>
          </div>
          <div className="panel-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>           {/* unread indicator */}
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Dismiss</th>
              </tr>
            </thead>
            <tbody>
              {displayedInbox.map(item => {
                const ts = (item.date || item.createdAt).toDate()
                return (
                  <tr key={item.id} onClick={() => openItem(item)}>
                    {/* 1) Unread dot or empty */}
                    <td>
                      {!item.read && <span className="unread-dot" />}
                    </td>
                    {/* 2) Date */}
                    <td>{ts.toLocaleDateString()}</td>
                    {/* 3) Time */}
                    <td>{ts.toLocaleTimeString()}</td>
                    {/* 4) Type literal */}
                    <td>{item.type}</td>
                    {/* 5) Dismiss button */}
                    <td>
                      <button
                        className="dismiss-button"
                        onClick={e => {
                          e.stopPropagation()
                          dismissItem(item)
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {showModal && modalItem && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modalItem.type === 'Dispute' ? (
              <>
                <h3>Dispute Detail</h3>
                <p><strong>User:</strong>{' '}
                  <button
                    className="link-button"
                    onClick={() => showStats(modalItem.userId)}
                  >
                    {getPlayerById(modalItem.userId).displayName}
                  </button>
                </p>
                <p><strong>Claim:</strong> {modalItem.claim}</p>
                <div className="modal-actions">
                  <button onClick={() => setShowModal(false)}>Close</button>
                  <button onClick={() => {/* unban logic */}}>Unban</button>
                </div>
              </>
            ) : (
              <>  {/* Report Detail */}
                <h3>Report Detail</h3>
                <p><strong>Accuser:</strong>{' '}
                  <button
                    className="link-button"
                    onClick={() => showStats(modalItem.accuserId)}
                  >
                    {getPlayerById(modalItem.accuserId).displayName}
                  </button>
                </p>
                <p><strong>Accused:</strong>{' '}
                  <button
                    className="link-button"
                    onClick={() => showStats(modalItem.accusedId)}
                  >
                    {getPlayerById(modalItem.accusedId).displayName}
                  </button>
                </p>
                <p><strong>Reason:</strong> {modalItem.reason}</p>
                <div className="modal-actions">
                  <button onClick={() => setShowModal(false)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && statsTarget && (
        <div className="modal-backdrop" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{statsTarget.displayName || statsTarget.email}’s Stats</h3>
            <p>Chess ELO: {statsTarget.chessElo}</p>
            <p>Chess Wins: {statsTarget.chessWins}</p>
            <p>Chess Losses: {statsTarget.chessLosses}</p>
            <p>RPS ELO: {statsTarget.rpsElo}</p>
            <p>RPS Wins: {statsTarget.rpsWins}</p>
            <p>RPS Losses: {statsTarget.rpsLosses}</p>
            <p>RNG ELO: {statsTarget.rngElo}</p>
            <p>RNG Wins: {statsTarget.rngWins}</p>
            <p>RNG Losses: {statsTarget.rngLosses}</p>
            <div className="modal-actions">
              <button onClick={() => setShowStatsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
