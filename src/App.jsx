import React from 'react';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/profile";

import Header from "./components/header";
import Home from "./components/home";
import Footer from "./components/footer";

import Chess from "./components/games/chess";
import RockPaperScissors from "./components/games/rps";
import RandomNumberGuesser from "./components/games/rng";


import { AuthProvider } from "./authContext/index.jsx";
import { useRoutes } from "react-router-dom";
import EloInput from "./components/eloInput/index.jsx";

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
            element: <Chess />,
        },
        {
            path: "/rps",
            element: <RockPaperScissors />,
        },
        {
            path: "/rng",
            element: <RandomNumberGuesser />,
        },
        {
            path: "/profile",
            element: <Profile />,
        },
        {
            path: "/eloInput",
            element: <EloInput />,
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