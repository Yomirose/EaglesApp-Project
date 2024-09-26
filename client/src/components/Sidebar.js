import React, { useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useSelector } from 'react-redux';
import EdithUserDetails from './EdithUserDetails';
import { FiArrowUpLeft } from "react-icons/fi";
import "../App.css";
import SearchUser from './SearchUser';


const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);


  return (
    <div className='w-full h-full grid grid-cols-[48px_1fr] bg-white z-5'>
        <div className='flex flex-col justify-between bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-700'>
            <div>
                <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                    <IoChatbubbleEllipses 
                        size={25}
                    />
                </NavLink>

                <div onClick={() => setOpenSearchUser(true)} className='w-12 h-12 flex justify-center mt-5 items-center cursor-pointer hover:bg-slate-200 rounded' title='add friend'>
                    <FaUserPlus 
                         size={25}
                    />
                </div>
            </div>

            <div className='flex flex-col items-center'>
                <button className='m-auto cursor-pointer hover:bg-slate-200 rounded' title={user?.name} onClick={() => {setEditUserOpen(true)}}>
                    <Avatar 
                        width={40}
                        height={40}
                        name={user?.name}
                        imageUrl={user?.profile_pic}
                        userId={user?._id}
                    />
                </button>
                <button className='w-12 h-12 flex justify-center mt-5 items-center cursor-pointer hover:bg-slate-200 rounded' title='logout'>
                    <span className='-ml-3'>
                        <BiLogOut 
                            size={25}
                        />
                    </span>
                </button>
            </div>
        </div>
        <div className='w-full'>
            <div className='h-16 flex items-center'>
                <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
            </div>
            <div className='bg-slate-200 p-[0.5px]'></div>
            <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                {
                    allUser.length === 0 && (
                        <div className='mt-12'>
                            <div className='arrow'>
                                <FiArrowUpLeft
                                    size={50}
                                />
                            </div>
                            <p className='text-lg text-center text-slate-600'>Explore user to start a conversation with.</p>
                        </div>
                    )
                }
            </div>
        </div>

        {
           editUserOpen && (
            <EdithUserDetails onClose={() => setEditUserOpen(false)} user={user} />
           ) 
        }

        {
            openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )
        }

    </div>
  )
}

export default Sidebar