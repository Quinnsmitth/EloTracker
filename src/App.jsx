import React from 'react';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/profile";

import Header from "./components/header";
import Home from "./components/home";
import Footer from "./components/footer";

import ChessInput from "./components/games/chess";
import RpsInput from "./components/games/rps";
import RngInput from "./components/games/rng";


import { AuthProvider } from "./authContext/index.jsx";
import { useRoutes } from "react-router-dom";
import Leaderboard from "./components/leaderboard/index.jsx";

function App() {
    const routesArray = [
        {
            path: "*",
            element: <Login />,
        },
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
            element: <ChessInput />,
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