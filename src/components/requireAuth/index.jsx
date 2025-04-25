// src/components/RequireAuth.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../authContext'

export default function RequireAuth({ children }) {
  const { currentUser, userData, loading } = useAuth()

  if (loading) {
    return <p>Loading…</p>
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  if (userData.banned) {
    return <Navigate to="/banned" replace />
  }
  return children
}
