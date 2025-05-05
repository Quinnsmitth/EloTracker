// src/App.jsx
import React from 'react'
import { AuthProvider, useAuth } from './authContext'
import { useRoutes }        from 'react-router-dom'

import Header        from './components/header'
import Footer        from './components/footer'
import Login         from './components/auth/login'
import Register      from './components/auth/register'
import Home          from './components/home'
import UnityGame     from './components/games/chess/UnityChess'
import RpsInput      from './components/games/rps'
import RngInput      from './components/games/rng'
import Profile       from './components/profile'
import Leaderboard   from './components/leaderboard'
import Admin         from './components/adminPage'
import AdminLogin    from './components/auth/adminLogin'
import AdminRegister from './components/auth/adminRegister'
import BannedPage    from './components/bannedPage'
import './App.css'

/**  
 *  This inner component _can_ call useAuth() because
 *  it lives _inside_ the AuthProvider.
 */
function AppContent() {
  const { userData } = useAuth()

  // redirect banned users
  if (userData?.banned) {
    return <BannedPage />
  }

  let routes = useRoutes([
    { path: "/login",          element: <Login /> },
    { path: "/register",       element: <Register /> },
    { path: "/home",           element: <Home /> },
    { path: "/chess",          element: <UnityGame /> },
    { path: "/rps",            element: <RpsInput /> },
    { path: "/rng",            element: <RngInput /> },
    { path: "/profile",        element: <Profile /> },
    { path: "/leaderboard",    element: <Leaderboard /> },
    { path: "/admin/login",    element: <AdminLogin /> },
    { path: "/admin/register", element: <AdminRegister /> },
    { path: "/admin",          element: <Admin /> },
    { path: "/banned",         element: <BannedPage /> },
    { path: "*",               element: <Login /> },
  ])

  return (
    <>
      <Header />
      <div className="w-full h-screen flex flex-col">
        {routes}
      </div>
      <Footer />
    </>
  )
}

/**
 *  App just sets up the provider at the very top.
 *  Nothing in here calls useAuth().
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}