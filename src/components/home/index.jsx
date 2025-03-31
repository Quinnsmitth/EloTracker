import React from 'react'
import { useAuth } from '../../authContext/index.jsx'
import homeHeader from "../header/home-header.jsx";
const Home = () => {
    const { currentUser } = useAuth()
    return (
       <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>
    )
}

export default Home