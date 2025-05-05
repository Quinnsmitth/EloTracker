import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { auth, firestore } from '../../firebase/firebase.js'
import { useAuth } from '../../authContext/index.jsx'
import './bannedPage.css'
import exitImage from '../../assets/PutnamPrime.png'

export default function BannedPage() {
  const { currentUser } = useAuth()

  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [claimText, setClaimText]               = useState('')
  const [submitting, setSubmitting]             = useState(false)
  const [hasDisputed, setHasDisputed]           = useState(false)
  const [currentTime, setCurrentTime]           = useState(new Date())

  useEffect(() => {
    const checkDispute = async () => {
      if (!currentUser) return
      const q = query(
        collection(firestore, 'Disputes'),
        where('userId', '==', currentUser.uid)
      )
      const snap = await getDocs(q)
      setHasDisputed(!snap.empty)
    }
    checkDispute()
  }, [currentUser])

  useEffect(() => {
    if (!showDisputeModal) return
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [showDisputeModal])

  const handleExit = async () => {
    try {
      const response = await fetch(exitImage)
      const blob     = await response.blob()
      const url      = URL.createObjectURL(blob)
      window.location.replace(url)
    } catch (err) {
      console.error('Exit failed:', err)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.replace('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const openDisputeModal = () => {
    setShowDisputeModal(true)
  }

  const submitDispute = async () => {
    if (!claimText.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(firestore, 'Disputes'), {
        userId: currentUser.uid,
        claim: claimText.trim(),
        createdAt: serverTimestamp()
      })
      setHasDisputed(true)
      setShowDisputeModal(false)
      setClaimText('')
      alert('Dispute submitted.')
    } catch (err) {
      console.error('Dispute failed:', err)
      alert('Failed to submit dispute.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="banned-container">
      <h2>You Are Banned</h2>
      <p>Your account has been banned.</p>

      <div className="banned-actions">
        <button className="exit-button" onClick={handleExit}>
          Exit
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="dispute-button"
          onClick={openDisputeModal}
          disabled={hasDisputed}
        >
          {hasDisputed ? 'Dispute Submitted' : 'Dispute'}
        </button>
      </div>

      {showDisputeModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Submit Dispute</h3>
            <p>
              <strong>Date:</strong> {currentTime.toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {currentTime.toLocaleTimeString()}
            </p>
            <textarea
              className="dispute-textarea"
              rows="5"
              placeholder="Describe your claim..."
              value={claimText}
              onChange={e => setClaimText(e.target.value)}
              disabled={submitting}
            />
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={() => setShowDisputeModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={submitDispute}
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
