import React from 'react'
import logo from "../assets/logo.png"

const AuthLayOuts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-6 h-20 shadow-md bg-primary'>
            <div className='items-center flex'>
            <img className='mb-2' src={logo} alt='logo' width={100} height={50} />
            <h1 className='font-bold mb-22 text-5xl text-white mr-2'>eaglesApp</h1>
            </div>
        </header>
    
        {children}
    </>
  )
}

export default AuthLayOuts