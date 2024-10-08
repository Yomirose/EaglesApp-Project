import React, { useEffect, useState } from 'react';
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
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
// import userDetails from '../../../server/controllers/userDetails';

const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit("sidebar", user._id)

            socketConnection.on("conversation", (data) =>{
                console.log("conversation", data)

                const conversationUserData = data.map((conversationUser, index) =>{

                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return{
                            ...conversationUser,
                            userDetails: conversationUser.receiver
                        }
                    }else{
                        return{
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        } 
                    }
                })
                setAllUser(conversationUserData)
            })
        }
    }, [socketConnection, user])

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

                {
                 allUser.map((conv, index) => {
                    return(
                        <NavLink to={"/"+ conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-gray-100 cursor-pointer'>
                            <div>
                                <Avatar
                                   imageUrl={conv?.userDetails?.profile_pic}
                                   name={conv?.userDetails?.name} 
                                   height={40}
                                   width={40}
                                />
                            </div>
                            <div>
                                <h2 className='text-ellipsis line-clamp-1 font-bold'>{conv?.userDetails?.name}</h2>
                                <div className='text-gray-600 text-xs flex items-center gap-1'>
                                    <div className='flex items-center gap-1'>
                                        {
                                          conv?.lastMsg?.imageUrl && (
                                            <div className='flex items-center gap-1'>
                                                <span><FaImage/></span>
                                                { !conv?.lastMsg?.text && <span>Image</span> } 
                                            </div>
                                          )
                                        }
                                        {
                                          conv?.lastMsg?.videoUrl && (
                                            <div className='flex items-center gap-1'>
                                                <span><FaVideo/></span>
                                                { !conv?.lastMsg?.text && <span>Video</span> }
                                            </div>
                                          )
                                        }
                                    </div>
                                    <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                </div>
                            </div>
                            <p className='flex justify-center items-center text-xs w-6 h-6 ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                        </NavLink>
                    )
                 })
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