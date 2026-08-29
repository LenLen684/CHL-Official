import React from 'react'
import { useState } from "react";
import { NavLink } from 'react-router-dom'
import Logo from '../assets/logo1.svg?react'


function Navbar() {
    const linkClasses = 'flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white'
    return (
        <nav className='flex navbar bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 justify-center'>
            <div className='flex justify-center w-9/10'>
                <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start '>
                    <NavLink to='/' className={linkClasses}>
                        <Logo className='h-12 w-auto text-chl-blue fill-current hover:text-rose-300' />
                    </NavLink>
                    <NavLink to='/league' className={linkClasses}>League History</NavLink>
                    <NavLink to='/valorant' className={linkClasses}>Valorant Stats</NavLink>
                    <NavLink to='/about' className={linkClasses}>About Us</NavLink>
                </div>
            </div>
        </nav>
    )
}


export { Navbar }