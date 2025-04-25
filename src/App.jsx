// src/App.jsx
import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'

import Login        from "./components/auth/login"
import Register     from "./components/auth/register"
import Profile      from "./components/profile"
import Header       from "./components/header"
import Home         from "./components/home"
import Footer       from "./components/footer"
import ChessInput   from "./components/games/chess"
import RpsInput     from "./components/games/rps"
import RngInput     from "./components/games/rng"
import Leaderboard  from "./components/leaderboard/index.jsx"
import Admin        from "./components/adminPage/index.jsx"
import AdminRegister from "./components/auth/adminRegister/index.jsx"
import AdminLogin   from "./components/auth/adminLogin/index.jsx"

import { AuthProvider } from "./authContext/index.jsx"
import RequireAuth     from "./components/requireAuth/index.jsx"
import BannedPage      from "./components/bannedPage/index.jsx"

function App() {
  const routesArray = [
    // Public
    { path: "/",        element: <Navigate to="/login" replace /> },
    { path: "/login",   element: <Login /> },
    { path: "/register",element: <Register /> },
    { path: "/admin/login",    element: <AdminLogin /> },
    { path: "/admin/register", element: <AdminRegister /> },

    // Banned notice
    { path: "/banned", element: <BannedPage /> },

    // Protected (only logged-in AND not banned)
    { path: "/home",       element: <RequireAuth><Home /></RequireAuth> },
    { path: "/chess",      element: <RequireAuth><ChessInput /></RequireAuth> },
    { path: "/rps",        element: <RequireAuth><RpsInput /></RequireAuth> },
    { path: "/rng",        element: <RequireAuth><RngInput /></RequireAuth> },
    { path: "/profile",    element: <RequireAuth><Profile /></RequireAuth> },
    { path: "/leaderboard",element: <RequireAuth><Leaderboard /></RequireAuth> },
    { path: "/admin",      element: <RequireAuth><Admin /></RequireAuth> },

    // Catch-all: send unknown URLs back to login (or you could render a 404)
    { path: "*", element: <Navigate to="/login" replace /> },
  ]

  const routesElement = useRoutes(routesArray)

  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">
        {routesElement}
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App
