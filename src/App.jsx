import React from 'react';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/profile";

import Header from "./components/header";
import Home from "./components/home";
import Footer from "./components/footer";

//import ChessInput from "./components/games/chess";
import RpsInput from "./components/games/rps";
import RngInput from "./components/games/rng";


import { AuthProvider } from "./authContext/index.jsx";
import { useRoutes } from "react-router-dom";
import Leaderboard from "./components/leaderboard/index.jsx";

import Admin from "./components/adminPage/index.jsx";
import AdminRegister from "./components/auth/adminRegister/index.jsx";
import AdminLogin from "./components/auth/adminLogin/index.jsx";
import UnityGame from "./components/games/chess/UnityChess.jsx";
import "./App.css";
function App() {
    const routesArray = [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/home",
            element: <Home />,
        },
        {
            path: "/chess",
            element: <UnityGame />
        },
        {
            path: "/rps",
            element: <RpsInput />,
        },
        {
            path: "/rng",
            element: <RngInput />,
        },
        {
            path: "/profile",
            element: <Profile />,
        },
        {
            path: "/leaderboard",
            element: <Leaderboard />,
        },
        {
            path: "/admin",
            element: <Admin />,
        },
        {
            path: "/admin/register",
            element: <AdminRegister />,
        },
        {
            path: "/admin/login",
            element: <AdminLogin />,
        },
        {
            path: "*",
            element: <Login />,
        }

    ];
    let routesElement = useRoutes(routesArray);
    return (
        <AuthProvider>
            <Header />
            <div className="w-full h-screen flex flex-col">{routesElement}</div>
            <Footer />
        </AuthProvider>
    );
}

export default App;