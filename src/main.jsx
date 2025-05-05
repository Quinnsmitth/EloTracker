import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Ensure this file exists
import { BrowserRouter } from 'react-router-dom';
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
         <App />
    </BrowserRouter>
);
