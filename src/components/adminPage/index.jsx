import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../firebase/firebase'
import { useAuth } from '../../authContext/index.jsx'
import './adminPage.css'

const Admin = () => {
  const { currentUser } = useAuth()
  const [players, setPlayers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true)
      try {
        const playerSnap = await getDocs(collection(firestore, 'Player'))
        setPlayers(playerSnap.docs.map(d => ({ id: d.id, ...d.data() })))

        const reportSnap = await getDocs(collection(firestore, 'Reports'))
        setReports(reportSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  if (loading) return <p className="admin-loading">Loading admin data…</p>

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-panels">
        {/* Players Panel */}
        <div className="panel players-panel">
          <h3>Players</h3>
          <div className="panel-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id}>
                    <td>{p.displayName || '—'}</td>
                    <td>{p.email || '—'}</td>
                    <td>{p.chessWins || 0}</td>
                    <td>{p.chessLoses || 0}</td>
                    <td>Ban</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reports Panel */}
        <div className="panel reports-panel">
          <h3>Reports</h3>
          <div className="panel-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Player</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.playerId}</td>
                    <td>{r.reason}</td>
                    <td>{r.date?.toDate().toLocaleString() || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
